import { Spinner } from '../spinner';

export function FullScreenLoader() {
  return (
    <div className="w-screen h-screen fixed">
      <div className="absolute top-64 left-1/2 -translate-x-1/2">
        <Spinner size="lg" />
      </div>
    </div>
  );
}
