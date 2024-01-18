import { getCookie } from './getCookie';

export function isAuthenticated(): string | null {
  const loggedIn = getCookie('logged_in');
  return loggedIn;
}
