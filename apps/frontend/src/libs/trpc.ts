import type { AppRouter } from '@repo/api';
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query';

import { queryClient } from './queryClient';

export const trpc = createTRPCReact<AppRouter>();

export const clientUtils = createTRPCQueryUtils<AppRouter>({
  // @ts-expect-error - known issue
  client: trpc,
  queryClient: queryClient,
});
