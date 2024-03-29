import { FullScreenLoader } from '@repo/ui';
import { createRouter, ErrorComponent } from '@tanstack/react-router';

import { queryClient, trpc } from '../libs';
import { routeTree } from './routeTree.gen';

export const router = createRouter({
  context: {
    queryClient,
    trpc,
  },
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
