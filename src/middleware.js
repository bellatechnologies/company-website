import { defineMiddleware } from 'astro:middleware';

// Check maintenance mode - handle both 'true' and 'TRUE' (case-insensitive)
const MAINTENANCE_MODE = import.meta.env.MAINTENANCE_MODE === 'true' || 
                          import.meta.env.MAINTENANCE_MODE === 'TRUE';

export const onRequest = defineMiddleware(async (context, next) => {
    if (MAINTENANCE_MODE) {
        // Allow access to the maintenance page itself
        if (context.url.pathname === '/maintenance') {
            return next();
        }

        // Allow access to static assets
        if (context.url.pathname.startsWith('/_astro/') ||
            context.url.pathname.startsWith('/favicon') ||
            context.url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico)$/)) {
            return next();
        }

        // Redirect all other requests to maintenance page
        return context.rewrite('/maintenance');
    }

    return next();
});