import { Spinner } from '../spinner';

export function FullScreenLoader() {
  return (
    <div className="fixed h-screen w-screen">
      <div className="absolute left-1/2 top-64 -translate-x-1/2">
        <Spinner size="lg" />
      </div>
    </div>
  );
}
