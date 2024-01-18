import { QueryTestPage } from './pages/QueryTestPage';
import { WelcomePage } from './pages/WelcomePage';
import { Providers } from './providers';

export function App() {
  return (
    <Providers>
      <WelcomePage />
      <QueryTestPage />
    </Providers>
  );
}
