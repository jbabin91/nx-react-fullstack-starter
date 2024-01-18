import { FileRoute } from '@tanstack/react-router';

import { trpc } from '../../../libs';

export const Route = new FileRoute('/posts/').createRoute({
  component: PostsPage,
});

function PostsPage() {
  const posts = trpc.post.getPosts.useQuery();

  console.log(posts?.data);

  return (
    <main className="p-2">
      <h3>Posts</h3>
    </main>
  );
}
