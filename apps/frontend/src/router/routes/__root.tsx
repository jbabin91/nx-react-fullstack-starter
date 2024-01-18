import { RootRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

import { Layout } from '../../components/layout';
import { trpc } from '../../libs';
import { useAuthStore } from '../../store';
import { router } from '../router';

export const Route = new RootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { setAuthUser } = useAuthStore();
  const {
    data: user,
    isError,
    isSuccess,
    error,
  } = trpc.auth.getMe.useQuery(undefined, {
    retry: 1,
    select: (data) => data.data.user,
  });

  useEffect(() => {
    if (isSuccess && user) {
      setAuthUser(user);
    }
  }, [isSuccess, user, setAuthUser]);

  useEffect(() => {
    if (isError) {
      console.log(error);
      if (error.message.includes('Could not refresh access token')) {
        router.navigate({ to: '/login' });
      }
    }
  }, [isError, error]);

  return <Layout />;
}
