#!/usr/bin/env python3
"""
Nginx maintenance mode configuration script.
Reads MAINTENANCE_MODE from .env.production and updates nginx config using template replacement.
"""

import os
import shutil
import subprocess
import sys
from datetime import datetime

ENV_FILE = "/var/www/bellatechnologies.in/.env.production"
TEMPLATE_FILE = "/var/www/bellatechnologies.in/scripts/bellatechnologies.in.template"
NGINX_CONFIG = "/etc/nginx/sites-available/bellatechnologies.in"

def read_maintenance_mode():
    """Read MAINTENANCE_MODE from environment file."""
    if not os.path.exists(ENV_FILE):
        print(f"WARNING: Environment file not found: {ENV_FILE}")
        print("   Assuming maintenance mode is disabled")
        return False
    
    try:
        with open(ENV_FILE, 'r') as f:
            for line in f:
                if line.startswith('MAINTENANCE_MODE='):
                    value = line.split('=', 1)[1].strip().lower()
                    return value in ('true', '1', 'yes')
    except Exception as e:
        print(f"WARNING: Error reading environment file: {e}")
        return False
    
    return False

def backup_config():
    """Create a backup of the nginx config."""
    if not os.path.exists(NGINX_CONFIG):
        return None
    
    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    backup_file = f"{NGINX_CONFIG}.backup.{timestamp}"
    shutil.copy2(NGINX_CONFIG, backup_file)
    print(f"Backup created: {backup_file}")
    return backup_file

def get_maintenance_mode_block():
    """Get the maintenance mode location blocks."""
    return """    # Maintenance mode - handle trailing slash redirect first
    location = /maintenance/ {
        return 302 /maintenance;
    }
    
    # Maintenance mode - serve maintenance page
    location = /maintenance {
        try_files $uri $uri.html /maintenance.html /maintenance/index.html =404;
    }
    
    # Maintenance mode redirect
    location / {
        # Allow access to maintenance page itself (both with and without trailing slash)
        if ($request_uri ~ ^/maintenance/?$) {
            break;
        }
        # Allow access to static assets
        if ($request_uri ~* ^/(_astro|favicon|.*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$)) {
            break;
        }
        # Redirect all other requests to maintenance page (without trailing slash to avoid loops)
        return 302 /maintenance;
    }

"""

def get_normal_location_block():
    """Get the normal site serving location block."""
    return """    # Normal site configuration (Astro SSR behind nginx)
    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Do not override Origin - let the browser's Origin pass through for Astro CSRF check

        # Optional websocket upgrade support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
        proxy_send_timeout 60s;

        proxy_pass http://127.0.0.1:4321;
    }

"""

def configure_nginx(maintenance_mode):
    """Configure nginx using template replacement."""
    # Check if template exists
    if not os.path.exists(TEMPLATE_FILE):
        print(f"ERROR: Template file not found: {TEMPLATE_FILE}")
        print("   Please ensure the template file is deployed")
        sys.exit(1)
    
    # Read template
    try:
        with open(TEMPLATE_FILE, 'r') as f:
            template_content = f.read()
    except Exception as e:
        print(f"ERROR: Failed to read template file: {e}")
        sys.exit(1)
    
    # Replace placeholders based on maintenance mode
    if maintenance_mode:
        print("Enabling maintenance mode in nginx...")
        maintenance_block = get_maintenance_mode_block()
        normal_location_block = ""
    else:
        print("Disabling maintenance mode in nginx...")
        maintenance_block = ""
        normal_location_block = get_normal_location_block()
    
    # Replace placeholders
    config_content = template_content.replace("{{MAINTENANCE_MODE_BLOCK}}", maintenance_block)
    config_content = config_content.replace("{{NORMAL_LOCATION_BLOCK}}", normal_location_block)
    
    # Check if content changed (read existing config if it exists)
    content_changed = True
    if os.path.exists(NGINX_CONFIG):
        try:
            with open(NGINX_CONFIG, 'r') as f:
                existing_content = f.read()
            if existing_content == config_content:
                print("   Configuration already in desired state")
                content_changed = False
        except Exception as e:
            print(f"   Warning: Could not read existing config: {e}")
    
    # Write new config
    if content_changed:
        try:
            with open(NGINX_CONFIG, 'w') as f:
                f.write(config_content)
            print("   Nginx configuration updated")
        except Exception as e:
            print(f"ERROR: Failed to write nginx config: {e}")
            sys.exit(1)
    
    return content_changed

def test_nginx():
    """Test nginx configuration."""
    print("Testing nginx configuration...")
    result = subprocess.run(['sudo', 'nginx', '-t'], capture_output=True, text=True)
    if result.returncode == 0:
        print("Nginx configuration is valid")
        return True
    else:
        print("ERROR: Nginx configuration test failed!")
        print(result.stderr)
        return False

def reload_nginx():
    """Reload nginx."""
    print("Reloading nginx...")
    result = subprocess.run(['sudo', 'systemctl', 'reload', 'nginx'], capture_output=True, text=True)
    if result.returncode == 0:
        print("Nginx reloaded successfully")
        return True
    else:
        print("ERROR: Failed to reload nginx!")
        print(result.stderr)
        return False

def main():
    """Main function."""
    print("Configuring nginx maintenance mode...")
    
    maintenance_mode = read_maintenance_mode()
    print(f"   MAINTENANCE_MODE: {maintenance_mode}")
    
    backup_file = backup_config()
    
    try:
        config_changed = configure_nginx(maintenance_mode)
        
        if config_changed:
            if test_nginx():
                reload_nginx()
            else:
                # Restore backup on failure
                if backup_file and os.path.exists(backup_file):
                    print("   Restoring backup...")
                    shutil.copy2(backup_file, NGINX_CONFIG)
                sys.exit(1)
        else:
            # Config didn't change, but still test to ensure it's valid
            if not test_nginx():
                sys.exit(1)
        
        print("Nginx maintenance mode configuration complete")
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        # Restore backup on failure
        if backup_file and os.path.exists(backup_file):
            print("   Restoring backup...")
            shutil.copy2(backup_file, NGINX_CONFIG)
        sys.exit(1)

if __name__ == '__main__':
    main()
