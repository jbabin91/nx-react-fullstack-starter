import { ModeToggle, RouterDevtools } from '@repo/ui';
import { Link, Outlet, rootRouteWithContext } from '@tanstack/react-router';

import { type Auth } from '../../utils/auth';

export const Route = rootRouteWithContext<{
  auth: Auth;
}>()({
  component: RootComponent,
});

function RootComponent() {
  const { auth } = Route.useRouteContext({
    select: ({ auth }) => ({ auth, status: auth.status }),
  });

  return (
    <div className="min-h-screen">
      <nav className="p-2 flex justify-between">
        <div className="flex gap-2 text-lg">
          {(
            [
              ['/', 'Home'],
              ['/posts', 'Posts'],
              ['/about', 'About'],
            ] as const
          ).map(([to, label]) => {
            return (
              <div key={to}>
                <Link
                  activeOptions={
                    {
                      // If the route points to the root of it's parent,
                      // make sure it's only active if it's exact
                      // exact: to === '.',
                    }
                  }
                  activeProps={{ className: `font-bold` }}
                  className={`block py-2 px-3 text-blue-700`}
                  preload="intent"
                  to={to}
                >
                  {label}
                </Link>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 text-lg">
          {auth?.username ? (
            <Link className={`block py-2 px-3 text-blue-700`} to={'/profile'}>
              Profile
            </Link>
          ) : (
            <Link className={`block py-2 px-3 text-blue-700`} to={'/login'}>
              Login
            </Link>
          )}
          <ModeToggle />
        </div>
      </nav>
      <hr />
      <main className="px-4 pt-2">
        <Outlet />
      </main>
      <RouterDevtools position="bottom-left" />
    </div>
  );
}
