import { getCookie } from './getCookie';

export function isAuthenticated(): boolean {
  const loggedIn = getCookie('logged_in');
  return Boolean(loggedIn);
}
