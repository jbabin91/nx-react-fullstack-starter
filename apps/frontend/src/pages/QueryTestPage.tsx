import { trpc } from '../libs';

export function QueryTestPage() {
  const hello = trpc.example.hello.useQuery();
  const users = trpc.user.getUsers.useQuery();

  console.log(users?.data);

  return (
    <main>
      <div>QueryTestPage</div>
      {hello?.data?.message && <div>{hello?.data.message}</div>}
    </main>
  );
}
