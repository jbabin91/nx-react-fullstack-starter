import { FileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = new FileRoute('/about').createRoute({
  component: lazyRouteComponent(
    () => import('./-components/AboutPage'),
    'AboutPage',
  ),
});
