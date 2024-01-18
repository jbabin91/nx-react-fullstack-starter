import { Button } from '@repo/ui';
import { FileRoute, useRouter } from '@tanstack/react-router';

export const Route = new FileRoute('/_auth/profile').createRoute({
  component: ProfilePage,
});

function ProfilePage() {
  const router = useRouter();
  const { auth, username } = Route.useRouteContext();
  return (
    <div className="p-2 space-y-4">
      <div>
        <h3 className="text-xl font-semibold">Profile</h3>
        <p className="text-base font-normal">
          Username: <strong>{username}</strong>
        </p>
      </div>
      <Button
        onClick={() => {
          auth.logout();
          router.invalidate();
        }}
      >
        Logout
      </Button>
    </div>
  );
}
