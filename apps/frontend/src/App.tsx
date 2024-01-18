import { ModeToggle } from '@repo/ui';

import { QueryTestPage } from './pages/QueryTestPage';
import { WelcomePage } from './pages/WelcomePage';
import { Providers } from './providers';

export function App() {
  return (
    <Providers>
      <ModeToggle />
      <WelcomePage />
      <QueryTestPage />
    </Providers>
  );
}
