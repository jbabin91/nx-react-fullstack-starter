import { trpc } from '../../../libs';

export function AboutPage() {
  const hello = trpc.example.hello.useQuery();
  const redIs = trpc.example.sayHello.useQuery();

  console.log(redIs.data?.message);

  return (
    <main className="p-2">
      <h3>About</h3>
      {hello?.data?.message && <div>{hello?.data.message}</div>}
    </main>
  );
}
