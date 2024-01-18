import { FileRoute } from '@tanstack/react-router';

export const Route = new FileRoute('/profile/').createRoute({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <main className="p-2">
      <h3>Profile</h3>
    </main>
  );
}
