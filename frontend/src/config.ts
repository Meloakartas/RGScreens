// For local development without Docker
const LOCAL_SERVER_BASE_URL = 'http://localhost:5000';

// For production browser environment
const PROD_BROWSER_URL = '/api'; // Empty means use relative URLs - will use the same domain

export const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:5000' : undefined;

// Use the environment variable if set, otherwise use the appropriate default
export const SERVER_BASE_URL = import.meta.env.DEV ? LOCAL_SERVER_BASE_URL : PROD_BROWSER_URL;