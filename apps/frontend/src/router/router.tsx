import { Spinner } from '@repo/ui';
import { ErrorComponent, Router } from '@tanstack/react-router';

import { auth } from '../utils/auth';
import { routeTree } from './routeTree.gen';

export const router = new Router({
  context: {
    auth,
  },
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  defaultPendingComponent: () => (
    <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2">
      <Spinner size="xl" />
    </div>
  ),
  defaultPreload: 'intent',
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
