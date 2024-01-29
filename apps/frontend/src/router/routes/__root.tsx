import { rootRouteWithContext } from '@tanstack/react-router';

import { Layout } from '../../components/layout';
import type { queryClient, trpc } from '../../libs';

export const Route = rootRouteWithContext<{
  trpc: typeof trpc;
  queryClient: typeof queryClient;
}>()({
  component: Layout,
});
