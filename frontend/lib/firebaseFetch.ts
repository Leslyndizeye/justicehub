import { auth } from '../components/firebaseConfig';
import { createAuthenticatedFetch } from './authenticatedFetch.js';

export const firebaseFetch = createAuthenticatedFetch({ getUser: () => auth.currentUser });
