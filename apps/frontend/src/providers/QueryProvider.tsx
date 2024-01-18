import { QueryDevtools } from '@repo/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFetch } from '@trpc/client';
import { httpBatchLink } from '@trpc/react-query';
import { useState } from 'react';

import { trpc } from '../libs';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: 'include',
            });
          },
          url: '/trpc',
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <QueryDevtools />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
