import { FileRoute, lazyRouteComponent } from '@tanstack/react-router';

import { clientUtils } from '../../../libs';

export const Route = new FileRoute('/posts/').createRoute({
  component: lazyRouteComponent(
    () => import('./-components/PostsPage'),
    'PostsPage',
  ),
  loader: () => postsLoader,
});

export async function postsLoader() {
  const allPostsData = await clientUtils.post.list.ensureData();

  return {
    allPostsData,
  };
}
