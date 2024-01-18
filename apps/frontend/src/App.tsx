import { WelcomePage } from './pages/WelcomePage';
import { Providers } from './providers';

export function App() {
  return (
    <Providers>
      <WelcomePage />
    </Providers>
  );
}