import type { Roles } from '../../libs/types';

export function RequiredRole({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Roles;
}) {
  return children;
}

// function RequiredUser() {
//   const [cookies] = useCookies(['logged_in']);
//   const { authUser: user } = useAuthStore();

//   return cookies.logged_in || user ? (
//     <Outlet />
//   ) : cookies.logged_in && user ? (
//     <Navigate replace to="/unauthorized" />
//   ) : (
//     <Navigate replace to="/login" />
//   );
// }
