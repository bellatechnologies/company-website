#!/usr/bin/env python3
"""
Nginx maintenance mode configuration script.
Reads MAINTENANCE_MODE from .env.production and updates nginx config accordingly.
"""

import os
import re
import shutil
import subprocess
import sys
from datetime import datetime

ENV_FILE = "/var/www/bellatechnologies.in/.env.production"
NGINX_CONFIG = "/etc/nginx/sites-available/bellatechnologies.in"

def read_maintenance_mode():
    """Read MAINTENANCE_MODE from environment file."""
    if not os.path.exists(ENV_FILE):
        print(f"⚠️  Environment file not found: {ENV_FILE}")
        print("   Assuming maintenance mode is disabled")
        return False
    
    try:
        with open(ENV_FILE, 'r') as f:
            for line in f:
                if line.startswith('MAINTENANCE_MODE='):
                    value = line.split('=', 1)[1].strip().lower()
                    return value in ('true', '1', 'yes')
    except Exception as e:
        print(f"⚠️  Error reading environment file: {e}")
        return False
    
    return False

def backup_config():
    """Create a backup of the nginx config."""
    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    backup_file = f"{NGINX_CONFIG}.backup.{timestamp}"
    shutil.copy2(NGINX_CONFIG, backup_file)
    print(f"📦 Backup created: {backup_file}")
    return backup_file

def configure_nginx(maintenance_mode):
    """Configure nginx based on maintenance mode setting."""
    if not os.path.exists(NGINX_CONFIG):
        print(f"❌ Nginx config not found: {NGINX_CONFIG}")
        print("   Please ensure nginx is configured first")
        sys.exit(1)
    
    # Read current config
    with open(NGINX_CONFIG, 'r') as f:
        lines = f.readlines()
    
    original_lines = lines.copy()
    
    # Maintenance redirect block (uncommented)
    maintenance_block = [
        '    # Maintenance mode redirect\n',
        '    location / {\n',
        '        # Allow access to maintenance page itself\n',
        '        if ($request_uri = /maintenance) {\n',
        '            break;\n',
        '        }\n',
        '        # Allow access to static assets\n',
        '        if ($request_uri ~* ^/(_astro|favicon|.*\\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$)) {\n',
        '            break;\n',
        '        }\n',
        '        # Redirect all other requests to maintenance page\n',
        '        return 302 /maintenance;\n',
        '    }\n',
        '\n',
        '    # Normal site configuration (disabled during maintenance)\n',
    ]
    
    # Commented maintenance block marker
    maintenance_marker = '# MAINTENANCE_MODE_START'
    maintenance_marker_end = '# MAINTENANCE_MODE_END'
    
    if maintenance_mode:
        print("🔒 Enabling maintenance mode in nginx...")
        
        # Check if maintenance mode is already active
        content_str = ''.join(lines)
        if re.search(r'location / \{.*?return 302 /maintenance', content_str, re.DOTALL):
            print("   ✅ Maintenance mode already enabled")
            return False
        
        # Find the HTTPS server block (look for listen 443 ssl)
        in_https_server = False
        brace_count = 0
        location_start_idx = -1
        location_end_idx = -1
        
        for i, line in enumerate(lines):
            # Detect HTTPS server block start
            if 'listen' in line and '443' in line and 'ssl' in line:
                in_https_server = True
                brace_count = line.count('{') - line.count('}')
            
            if in_https_server:
                brace_count += line.count('{') - line.count('}')
                
                # Find location / block
                if re.match(r'\s+location\s+/\s*\{', line) and location_start_idx == -1:
                    location_start_idx = i
                
                # Find end of location block (when we hit the closing brace at same indent level)
                if location_start_idx != -1 and location_end_idx == -1:
                    if re.match(r'\s+\}', line) and brace_count <= 1:
                        location_end_idx = i
                        break
                
                # End of server block
                if brace_count <= 0 and location_start_idx != -1:
                    location_end_idx = i - 1
                    break
        
        if location_start_idx == -1:
            print("   ⚠️  Could not find location / block in HTTPS server block")
            print("   Please ensure your nginx config has a location / block")
            return False
        
        # Comment out the existing location block
        commented_location = []
        for i in range(location_start_idx, location_end_idx + 1):
            if lines[i].strip() and not lines[i].strip().startswith('#'):
                # Preserve indentation, add comment
                indent = len(lines[i]) - len(lines[i].lstrip())
                commented_location.append(' ' * indent + '# ' + lines[i].lstrip())
            else:
                commented_location.append(lines[i])
        
        # Insert maintenance block + commented location
        new_lines = (
            lines[:location_start_idx] +
            maintenance_block +
            commented_location +
            lines[location_end_idx + 1:]
        )
        
        lines = new_lines
        
    else:
        print("🌐 Disabling maintenance mode in nginx...")
        
        # Check if maintenance mode is already disabled
        content_str = ''.join(lines)
        if not re.search(r'location / \{.*?return 302 /maintenance', content_str, re.DOTALL):
            print("   ✅ Maintenance mode already disabled")
            return False
        
        # Find and remove maintenance redirect block
        # Look for maintenance redirect pattern
        maintenance_start = -1
        maintenance_end = -1
        normal_location_start = -1
        
        for i, line in enumerate(lines):
            if 'return 302 /maintenance' in line:
                # Found maintenance redirect, work backwards to find start
                for j in range(i, -1, -1):
                    if 'location / {' in lines[j] and 'Maintenance mode redirect' in ''.join(lines[max(0, j-2):j]):
                        maintenance_start = j - 1  # Include comment line
                        break
                # Work forwards to find end
                for j in range(i, len(lines)):
                    if re.match(r'\s+\}', lines[j]):
                        maintenance_end = j
                        break
                # Find commented normal location block
                for j in range(maintenance_end + 1, len(lines)):
                    if '# Normal site configuration' in lines[j]:
                        # Find the commented location block
                        for k in range(j + 1, len(lines)):
                            if '# location /' in lines[k]:
                                normal_location_start = k
                                break
                        break
                break
        
        if maintenance_start == -1 or maintenance_end == -1:
            print("   ⚠️  Could not find maintenance redirect block")
            return False
        
        # Find end of commented location block
        normal_location_end = normal_location_start
        if normal_location_start != -1:
            for i in range(normal_location_start + 1, len(lines)):
                if re.match(r'\s+#\s*\}', lines[i]):
                    normal_location_end = i
                    break
        
        # Uncomment the normal location block
        if normal_location_start != -1:
            uncommented_location = []
            for i in range(normal_location_start, normal_location_end + 1):
                line = lines[i]
                # Remove comment markers while preserving indentation
                if line.strip().startswith('#'):
                    # Remove # and following space if present
                    uncommented = re.sub(r'^(\s*)#\s*', r'\1', line)
                    uncommented_location.append(uncommented)
                else:
                    uncommented_location.append(line)
            
            # Replace maintenance block + commented location with uncommented location
            lines = (
                lines[:maintenance_start] +
                uncommented_location +
                lines[normal_location_end + 1:]
            )
        else:
            # Just remove maintenance block
            lines = lines[:maintenance_start] + lines[maintenance_end + 1:]
    
    # Only write if content changed
    if lines != original_lines:
        with open(NGINX_CONFIG, 'w') as f:
            f.writelines(lines)
        print("   ✅ Nginx configuration updated")
        return True
    else:
        print("   ✅ Configuration already in desired state")
        return False

def test_nginx():
    """Test nginx configuration."""
    print("🧪 Testing nginx configuration...")
    result = subprocess.run(['sudo', 'nginx', '-t'], capture_output=True, text=True)
    if result.returncode == 0:
        print("✅ Nginx configuration is valid")
        return True
    else:
        print("❌ Nginx configuration test failed!")
        print(result.stderr)
        return False

def reload_nginx():
    """Reload nginx."""
    print("🔄 Reloading nginx...")
    result = subprocess.run(['sudo', 'systemctl', 'reload', 'nginx'], capture_output=True, text=True)
    if result.returncode == 0:
        print("✅ Nginx reloaded successfully")
        return True
    else:
        print("❌ Failed to reload nginx!")
        print(result.stderr)
        return False

def main():
    """Main function."""
    print("🔧 Configuring nginx maintenance mode...")
    
    maintenance_mode = read_maintenance_mode()
    print(f"   MAINTENANCE_MODE: {maintenance_mode}")
    
    backup_file = backup_config()
    
    try:
        if configure_nginx(maintenance_mode):
            if test_nginx():
                reload_nginx()
            else:
                # Restore backup on failure
                print("   Restoring backup...")
                shutil.copy2(backup_file, NGINX_CONFIG)
                sys.exit(1)
        else:
            # Config didn't change, but still test
            test_nginx()
        
        print("✅ Nginx maintenance mode configuration complete")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        print("   Restoring backup...")
        shutil.copy2(backup_file, NGINX_CONFIG)
        sys.exit(1)

if __name__ == '__main__':
    main()
