import { AppProviders } from './app/providers/AppProviders';
import { AppRoutes } from './app/router/routes';
import './index.css';

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
