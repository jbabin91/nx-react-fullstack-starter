import { RouterDevtools, Toaster } from '@repo/ui';
import { Outlet } from '@tanstack/react-router';

import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { Header } from './header';

export function Layout() {
  return (
    <AuthMiddleware>
      <div className="min-h-screen">
        <Header />
        <main className="px-4 pt-2">
          <Outlet />
        </main>
        {/* TODO: Consider moving to react-hot-toast or upgrading shadcn toast to allow setting the position */}
        <Toaster />
        <RouterDevtools position="bottom-left" />
      </div>
    </AuthMiddleware>
  );
}
