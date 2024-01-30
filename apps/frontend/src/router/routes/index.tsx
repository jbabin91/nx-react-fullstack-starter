import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: lazyRouteComponent(
    () => import('./-components/HomePage'),
    'HomePage',
  ),
});
