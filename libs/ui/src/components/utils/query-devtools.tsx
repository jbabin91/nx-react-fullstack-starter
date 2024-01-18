import { lazy } from 'react';

export const QueryDevtools =
  import.meta.env.MODE === 'production'
    ? () => null // Render nothing in production
    : lazy(() =>
        import('@tanstack/react-query-devtools').then((res) => ({
          default: res.ReactQueryDevtools,
        })),
      );
