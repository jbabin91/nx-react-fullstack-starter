import { FullScreenLoader } from '@repo/ui';
import { ErrorComponent, Router } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

export const router = new Router({
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  defaultPendingComponent: FullScreenLoader,
  defaultPreload: 'intent',
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
