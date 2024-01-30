import { createFileRoute } from '@tanstack/react-router';

import { useAuthStore } from '../../store';

export const Route = createFileRoute('/_auth/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { authUser: user } = useAuthStore();

  return (
    <div className="space-y-4 p-2">
      <div>
        <h3 className="text-xl font-semibold">Profile</h3>
        <p className="text-base font-normal">
          Email: <strong>{user?.email}</strong>
        </p>
      </div>
    </div>
  );
}
