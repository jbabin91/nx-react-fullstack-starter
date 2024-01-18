import { trpc } from '../../../../libs';

export function PostsPage() {
  const posts = trpc.post.list.useQuery();

  if (posts.error) return <h3>Error</h3>;

  if (posts.isLoading) return <h3>Loading...</h3>;

  return (
    <main className="p-2">
      <h3>Posts</h3>
      <pre>{JSON.stringify(posts.data, null, 2)}</pre>
    </main>
  );
}
