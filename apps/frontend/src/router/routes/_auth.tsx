import { FileRoute, Navigate, Outlet, redirect } from '@tanstack/react-router';
import { useCookies } from 'react-cookie';

import { useAuthStore } from '../../store';
import { isAuthenticated } from '../../utils';

export const Route = new FileRoute('/_auth')
  .createRoute({
    // Before loading, authenticate the user via our auth context
    // This will also happen during prefetching (e.g. hovering over links, etc)
    beforeLoad: ({ location }) => {
      // If the user is logged out, redirect them to the login page
      if (!isAuthenticated()) {
        throw redirect({
          search: {
            // Use the current location to power a redirect after login
            // (Do not use `router.state.resolvedLocation` as it can
            // potentially lag behind the actual current location)
            redirect: location.href,
          },
          to: '/login',
        });
      }
      // Otherwise, return
      return;
    },
  })
  .update({
    component: RequiredUser,
  });

function RequiredUser() {
  const [cookies] = useCookies(['logged_in']);
  const { authUser: user } = useAuthStore();

  return cookies.logged_in || user ? (
    <Outlet />
  ) : cookies.logged_in && user ? (
    <Navigate replace to="/unauthorized" />
  ) : (
    <Navigate replace to="/login" />
  );
}
