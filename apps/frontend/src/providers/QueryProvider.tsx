import { QueryDevtools } from '@repo/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { getFetch, loggerLink } from '@trpc/client';
import { httpBatchLink } from '@trpc/react-query';
import { useState } from 'react';

import { queryClient, trpc } from '../libs';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => queryClient);
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink(),
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
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        {children}
        <QueryDevtools />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
