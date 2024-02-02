import { createRootRouteWithContext } from '@tanstack/react-router';

import { Layout } from '../../components/layout';
import type { queryClient, trpc } from '../../libs';

export const Route = createRootRouteWithContext<{
  trpc: typeof trpc;
  queryClient: typeof queryClient;
}>()({
  component: Layout,
});
