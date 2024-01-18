import { FileRoute, redirect } from '@tanstack/react-router';

import { auth } from '../../utils/auth';

export const Route = new FileRoute('/_auth').createRoute({
  // Before loading, authenticate the user via our auth context
  // This will also happen during prefetching (e.g. hovering over links, etc)
  beforeLoad: ({ context, location }) => {
    // If the user is logged out, redirect them to the login page
    if (context.auth.status === 'loggedOut') {
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
    // Otherwise, return the user in context
    return {
      username: auth.username,
    };
  },
});
