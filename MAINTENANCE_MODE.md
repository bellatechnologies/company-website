# Astro Maintenance Mode Implementation

## Overview

Astro does not have a built-in maintenance mode feature. However, you can implement maintenance mode using Astro's middleware functionality, which allows you to intercept requests and responses before they reach your pages.

## Basic Implementation

### 1. Create a Maintenance Page

Create a maintenance page at `src/pages/maintenance.astro`:

```astro
---
// src/pages/maintenance.astro
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Under Maintenance</title>
</head>
<body>
    <div style="text-align: center; padding: 50px;">
        <h1>🚧 Site Under Maintenance</h1>
        <p>We're currently performing maintenance. Please check back soon!</p>
        <p>Expected downtime: 2-4 hours</p>
    </div>
</body>
</html>
```

### 2. Create Middleware for Maintenance Mode

Create `src/middleware.js`:

```javascript
// src/middleware.js
import { defineMiddleware } from 'astro:middleware';

// Set this to true to enable maintenance mode
const MAINTENANCE_MODE = true;

export const onRequest = defineMiddleware(async (context, next) => {
    if (MAINTENANCE_MODE) {
        // Allow access to the maintenance page itself
        if (context.url.pathname === '/maintenance') {
            return next();
        }

        // Allow access to static assets (optional)
        if (context.url.pathname.startsWith('/_astro/') ||
            context.url.pathname.startsWith('/favicon') ||
            context.url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico)$/)) {
            return next();
        }

        // Redirect to maintenance page
        return context.rewrite('/maintenance');
    }

    return next();
});
```

## Alternative: HTTP 503 Response

Instead of redirecting to a maintenance page, you can return a 503 Service Unavailable response:

```javascript
export const onRequest = defineMiddleware(async (context, next) => {
    if (MAINTENANCE_MODE) {
        // Skip middleware for allowed paths
        if (context.url.pathname === '/maintenance' ||
            context.url.pathname.startsWith('/_astro/')) {
            return next();
        }

        return new Response(
            `<html>
                <head><title>Service Unavailable</title></head>
                <body>
                    <h1>503 Service Unavailable</h1>
                    <p>Site is under maintenance. Please try again later.</p>
                </body>
            </html>`,
            {
                status: 503,
                headers: {
                    'Content-Type': 'text/html',
                    'Retry-After': '3600' // 1 hour in seconds
                }
            }
        );
    }

    return next();
});
```

## Controlling Maintenance Mode

### Environment Variable Approach

Create or modify your `.env` file:

```bash
MAINTENANCE_MODE=true
```

Update your middleware to read from environment variables:

```javascript
// src/middleware.js
import { defineMiddleware } from 'astro:middleware';

const MAINTENANCE_MODE = import.meta.env.MAINTENANCE_MODE === 'true';

export const onRequest = defineMiddleware(async (context, next) => {
    if (MAINTENANCE_MODE) {
        // ... maintenance mode logic
    }

    return next();
});
```

### Configuration File Approach

Create `src/config/maintenance.js`:

```javascript
// src/config/maintenance.js
export const maintenanceConfig = {
    enabled: false,
    message: "Site is under maintenance",
    expectedDowntime: "2-4 hours",
    allowedIPs: ['127.0.0.1', '::1'], // localhost
    allowedPaths: ['/admin', '/api/health']
};
```

Update your middleware:

```javascript
// src/middleware.js
import { defineMiddleware } from 'astro:middleware';
import { maintenanceConfig } from './config/maintenance.js';

export const onRequest = defineMiddleware(async (context, next) => {
    if (maintenanceConfig.enabled) {
        // Allow specific IPs
        const clientIP = context.clientAddress;
        if (maintenanceConfig.allowedIPs.includes(clientIP)) {
            return next();
        }

        // Allow specific paths
        if (maintenanceConfig.allowedPaths.some(path => context.url.pathname.startsWith(path))) {
            return next();
        }

        // Allow maintenance page and assets
        if (context.url.pathname === '/maintenance' ||
            context.url.pathname.startsWith('/_astro/')) {
            return next();
        }

        return context.rewrite('/maintenance');
    }

    return next();
});
```

## Advanced Features

### IP Whitelisting

Allow certain IP addresses to bypass maintenance mode:

```javascript
const ALLOWED_IPS = ['192.168.1.100', '10.0.0.1'];

export const onRequest = defineMiddleware(async (context, next) => {
    if (MAINTENANCE_MODE) {
        const clientIP = context.clientAddress;
        if (ALLOWED_IPS.includes(clientIP)) {
            return next();
        }
        // ... rest of maintenance logic
    }
    return next();
});
```

### Admin Bypass with Query Parameter

Allow access with a special query parameter:

```javascript
export const onRequest = defineMiddleware(async (context, next) => {
    if (MAINTENANCE_MODE) {
        // Check for admin bypass
        const url = new URL(context.request.url);
        if (url.searchParams.get('admin') === 'true') {
            return next();
        }
        // ... rest of maintenance logic
    }
    return next();
});
```

### Scheduled Maintenance

Enable maintenance mode based on time:

```javascript
const MAINTENANCE_SCHEDULE = {
    start: new Date('2024-01-15T02:00:00Z'),
    end: new Date('2024-01-15T06:00:00Z')
};

const isMaintenanceTime = () => {
    const now = new Date();
    return now >= MAINTENANCE_SCHEDULE.start && now <= MAINTENANCE_SCHEDULE.end;
};

export const onRequest = defineMiddleware(async (context, next) => {
    if (isMaintenanceTime()) {
        // ... maintenance logic
    }
    return next();
});
```

### Partial Maintenance

Only block certain routes:

```javascript
const MAINTENANCE_ROUTES = ['/blog', '/products'];

export const onRequest = defineMiddleware(async (context, next) => {
    if (MAINTENANCE_MODE) {
        const isMaintenanceRoute = MAINTENANCE_ROUTES.some(route =>
            context.url.pathname.startsWith(route)
        );

        if (isMaintenanceRoute) {
            return context.rewrite('/maintenance');
        }
    }
    return next();
});
```

## Best Practices

1. **Test Thoroughly**: Test maintenance mode in a staging environment before deploying to production.

2. **Monitor Logs**: Ensure your logging still works during maintenance mode.

3. **SEO Considerations**: Return appropriate HTTP status codes (503) for search engines.

4. **User Communication**: Provide clear messaging about when the site will be back online.

5. **Admin Access**: Always have a way for administrators to bypass maintenance mode.

6. **Asset Loading**: Allow CSS, JS, and image assets to load so your maintenance page renders properly.

7. **API Endpoints**: Consider if you need to allow certain API endpoints during maintenance.

## Troubleshooting

### Middleware Not Working
- Ensure the middleware file is named exactly `middleware.js` (or `middleware.ts`)
- Check that the file is in the `src/` directory
- Verify the export is named `onRequest`

### Assets Not Loading
- Make sure you're allowing `/_astro/` paths through the middleware
- Check that static assets in `public/` are being served

### Environment Variables Not Working
- Ensure you're using `import.meta.env` in Astro middleware
- Check that your `.env` file is in the project root
- Restart your dev server after changing environment variables

## Related Astro Features

- **Middleware**: Official Astro documentation for middleware
- **Rewrites**: Using `context.rewrite()` for redirecting requests
- **Environment Variables**: Managing configuration with `.env` files
- **SSR/SSG**: Understanding when middleware runs (build time vs runtime)

This implementation provides a flexible, production-ready maintenance mode solution for Astro websites.