import { FileRoute } from '@tanstack/react-router';

export const Route = new FileRoute('/unauthorized').createRoute({
  component: UnAuthorizedComponent,
});

function UnAuthorizedComponent() {
  return <div>Unauthorized</div>;
}
