import { ModeToggle } from '@repo/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';

import { trpc } from '../../libs';
import { useAuthStore } from '../../store';

export function Header() {
  const router = useRouter();
  const { authUser: user, setAuthUser } = useAuthStore();

  const queryClient = useQueryClient();
  const { mutate: logoutUser } = trpc.auth.logout.useMutation({
    onError: (error) => {
      queryClient.clear();
      router.invalidate();
      router.navigate({ to: '/login' });
    },
    onSuccess: () => {
      setAuthUser(null);
      queryClient.clear();
      router.invalidate();
      router.navigate({ to: '/login' });
    },
  });

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <header className="h-20 bg-zinc-800">
      <nav className="container flex h-full items-center justify-between">
        <div>
          <Link
            className="inline-block bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 bg-clip-text text-2xl font-semibold text-transparent"
            to="/"
          >
            Fullstack Starter
          </Link>
        </div>
        <ul className="flex items-center gap-4">
          {(
            [
              ['/', 'Home'],
              ['/posts', 'Posts'],
              ['/about', 'About'],
            ] as const
          ).map(([to, label]) => {
            return (
              <li key={to}>
                <Link
                  activeOptions={
                    {
                      // If the route points to the root of it's parent,
                      // make sure it's only active if it's exact
                      // exact: to === '.',
                    }
                  }
                  activeProps={{ className: `font-bold text-indigo-500` }}
                  className="text-blue-500"
                  preload="intent"
                  to={to}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          {!user && (
            <>
              <li>
                <Link
                  activeProps={{ className: `font-bold text-indigo-500` }}
                  className="text-blue-500"
                  to="/register"
                >
                  SignUp
                </Link>
              </li>
              <li>
                <Link
                  activeProps={{ className: `font-bold text-indigo-500` }}
                  className="text-blue-500"
                  to="/login"
                >
                  Login
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link
                  activeProps={{ className: `font-bold text-indigo-500` }}
                  className="text-blue-500"
                  to="/profile"
                >
                  Profile
                </Link>
              </li>
              <li className="cursor-pointer">Create Post</li>
              <li className="cursor-pointer" onClick={handleLogout}>
                Logout
              </li>
            </>
          )}
          <li>
            <ModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
