import { Button } from '@repo/ui';
import { FileRoute, useRouter } from '@tanstack/react-router';

import { useAuthStore } from '../../store';

export const Route = new FileRoute('/_auth/profile').createRoute({
  component: ProfilePage,
});

function ProfilePage() {
  const router = useRouter();
  const { authUser: user, logout } = useAuthStore();

  return (
    <div className="p-2 space-y-4">
      <div>
        <h3 className="text-xl font-semibold">Profile</h3>
        <p className="text-base font-normal">
          Email: <strong>{user?.email}</strong>
        </p>
      </div>
      <Button
        onClick={() => {
          logout();
          router.invalidate();
        }}
      >
        Logout
      </Button>
    </div>
  );
}
