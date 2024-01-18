import { ModeToggle } from '@repo/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';

import { trpc } from '../../libs';
import { useAuthStore } from '../../store';

export function Header() {
  const router = useRouter();
  const { authUser: user } = useAuthStore();

  const queryClient = useQueryClient();
  const { mutate: logoutUser } = trpc.auth.logout.useMutation({
    onError: (error) => {
      queryClient.clear();
      router.invalidate();
      router.navigate({ to: '/login' });
      // document.location.href = '/login';
    },
    onSuccess: (data) => {
      queryClient.clear();
      router.invalidate();
      router.navigate({ to: '/login' });
      // document.location.href = '/login';
    },
  });

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <header className="h-20 bg-zinc-800">
      <nav className="h-full flex justify-between container items-center">
        <div>
          <Link
            className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text text-2xl font-semibold"
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
