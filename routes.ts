/**
 * An array of public accessible routes. This route don't require authentication.
 * @type {string[]}
 */
export const publicRoutes: string[] =[
    "/",
];

/**
 * Routes for authentication.
 */
export const authRoutes =[
    "/login",
    "/register"
];

/**
 * The prefix for API authentication routes. Should be accessible to all at all times
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in. 
 */ 
export const DEFAULT_LOGIN_REDIRECT = "/home"