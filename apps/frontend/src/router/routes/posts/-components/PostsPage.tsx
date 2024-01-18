import { trpc } from '../../../../libs';

export function PostsPage() {
  const posts = trpc.post.getPosts.useQuery();

  console.log(posts?.data);

  return (
    <main className="p-2">
      <h3>Posts</h3>
    </main>
  );
}
