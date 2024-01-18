import { FileRoute, lazyRouteComponent } from '@tanstack/react-router';

export const Route = new FileRoute('/posts/').createRoute({
  component: lazyRouteComponent(
    () => import('./-components/PostsPage'),
    'PostsPage',
  ),
});
