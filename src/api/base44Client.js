import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
// export const base44 = createClient({
//   appId: "68ff24d5d15fe1d906eac90e", 
//   requiresAuth: false // Ensure authentication is required for all operations
// });

// detect environment safely in Vite
const isLocal = import.meta.env.VITE_BASE44_ENV === 'development';

// Create a Base44 client
export const base44 = createClient({
  appId: import.meta.env.VITE_BASE44_APP_ID,
  requiresAuth: !isLocal, // disable auth when developing locally
});