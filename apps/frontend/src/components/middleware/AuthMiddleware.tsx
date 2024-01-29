import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { trpc } from '../../libs';
import { useAuthStore } from '../../store';

const protectedRoutes = new Set(['/profile']);

export function AuthMiddleware({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [cookies] = useCookies(['logged_in', 'access_token']);
  const { setAuthUser } = useAuthStore();

  const queryClient = useQueryClient();
  const {
    refetch,
    isSuccess: refreshIsSuccess,
    isError: refreshIsError,
    error: refreshError,
  } = trpc.auth.refreshToken.useQuery(undefined, {
    enabled: false,
    retry: 1,
  });

  const { data: user, isSuccess: getMeIsSuccess } = trpc.auth.getMe.useQuery(
    undefined,
    {
      enabled: !!cookies.logged_in,
      retry: 1,
      select: (data) => data.user,
    },
  );

  useEffect(() => {
    if (refreshIsSuccess) {
      queryClient.invalidateQueries({ queryKey: ['auth', 'getMe'] });
    }
  }, [refreshIsSuccess, queryClient]);

  useEffect(() => {
    if (getMeIsSuccess && user) {
      setAuthUser(user);
    }
  }, [getMeIsSuccess, setAuthUser, user]);

  useEffect(() => {
    if (
      refreshIsError &&
      refreshError?.message.includes('Could not refresh access token') &&
      protectedRoutes.has(router.state.location.href) &&
      !cookies.logged_in
    ) {
      router.navigate({ to: '/login' });
    }
  }, [
    refreshIsError,
    refreshError?.message,
    router,
    router.state.location.href,
    cookies.logged_in,
  ]);

  useEffect(() => {
    if (!cookies.logged_in) {
      refetch();
    }
  }, [cookies.logged_in, refetch, user]);

  return children;
}

// function AuthMiddleware() {
//   const router = useRouter();
//   const [cookies] = useCookies(['logged_in']);
//   const store = useAuthStore();

//   const queryClient = useQueryClient();
//   const {
//     refetch,
//     isSuccess: refreshIsSuccess,
//     isError: refreshIsError,
//     error: refreshError,
//   } = trpc.auth.refreshToken.useQuery(undefined, {
//     enabled: false,
//     retry: 1,
//   });

//   useEffect(() => {
//     if (refreshIsSuccess) {
//       queryClient.invalidateQueries({ queryKey: ['auth', 'getMe'] });
//     }
//   }, [refreshIsSuccess]);

//   const {
//     data: user,
//     isSuccess: getMeIsSuccess,
//     isError: getMeIsError,
//     error: getMeError,
//     isLoading: getMeIsLoading,
//   } = trpc.auth.getMe.useQuery(undefined, {
//     enabled: !!cookies.logged_in,
//     retry: 1,
//     select: (data) => data.data.user,
//   });

//   useEffect(() => {
//     if (getMeIsSuccess && user) {
//       store.setAuthUser(user);
//     }
//   }, [getMeIsSuccess]);

//   useEffect(() => {
//     console.log('getMeIsError', getMeIsError);
//     console.log('getMeError', getMeError?.message);
//     let retryRequest = true;
//     if (
//       getMeIsError &&
//       getMeError.message.includes('must be logged in') &&
//       retryRequest
//     ) {
//       retryRequest = false;
//       try {
//         console.log('refreshing tokens');
//         refetch();
//       } catch (error: any) {
//         console.log(error);
//         if (error.message.includes('Could not refresh access token')) {
//           router.navigate({ to: '/login' });
//         }
//       }
//     }
//   }, [getMeIsError]);

//   useEffect(() => {
//     if (
//       refreshIsError &&
//       refreshError?.message.includes('Could not refresh access token')
//     ) {
//       router.navigate({ to: '/login' });
//     }
//   }, [refreshIsError]);

//   if (getMeIsLoading && cookies.logged_in) {
//     return <FullScreenLoader />;
//   }

//   return <Outlet />;
// }
