import { Router } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

export const router = new Router({
  defaultPreload: 'intent',
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
