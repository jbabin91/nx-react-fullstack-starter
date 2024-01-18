import { FileRoute } from '@tanstack/react-router';

import { trpc } from '../../../libs';

export const Route = new FileRoute('/about/').createRoute({
  component: AboutPage,
});

function AboutPage() {
  const hello = trpc.example.hello.useQuery();
  const users = trpc.user.getUsers.useQuery();

  console.log(users?.data);

  return (
    <main className="p-2">
      <h3>About</h3>
      {hello?.data?.message && <div>{hello?.data.message}</div>}
    </main>
  );
}
