import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/unauthorized')({
  component: UnAuthorizedComponent,
});

function UnAuthorizedComponent() {
  return <div>Unauthorized</div>;
}
