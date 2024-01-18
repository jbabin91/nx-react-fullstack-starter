import { ModeToggle, RouterDevtools } from '@repo/ui';
import { Link, Outlet, RootRoute } from '@tanstack/react-router';

export const Route = new RootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <nav className="p-2 flex justify-between">
        <div className="p-2 flex gap-2 text-lg">
          <Link
            activeOptions={{ exact: true }}
            activeProps={{
              className: 'font-bold',
            }}
            to="/"
          >
            Home
          </Link>
          <Link
            activeProps={{
              className: 'font-bold',
            }}
            to={'/posts'}
          >
            Posts
          </Link>
          <Link
            activeProps={{
              className: 'font-bold',
            }}
            to={'/about'}
          >
            About
          </Link>
          <Link
            activeProps={{
              className: 'font-bold',
            }}
            to={'/profile'}
          >
            Profile
          </Link>
        </div>
        <div className="p-1">
          <ModeToggle />
        </div>
      </nav>
      <hr />
      <Outlet />
      <RouterDevtools position="bottom-left" />
    </>
  );
}
