import { FileRoute } from '@tanstack/react-router';

import { useAuthStore } from '../../store';

export const Route = new FileRoute('/_auth/profile').createRoute({
  component: ProfilePage,
});

function ProfilePage() {
  const { authUser: user } = useAuthStore();

  return (
    <div className="p-2 space-y-4">
      <div>
        <h3 className="text-xl font-semibold">Profile</h3>
        <p className="text-base font-normal">
          Email: <strong>{user?.email}</strong>
        </p>
      </div>
    </div>
  );
}