import { RouterProvider } from '@tanstack/react-router';
import { Suspense } from 'react';

import { Providers } from './providers';
import { router } from './router';

export function App() {
  return (
    <Providers>
      <Suspense fallback={<>loading...</>}>
        <RouterProvider router={router} />
      </Suspense>
    </Providers>
  );
}
