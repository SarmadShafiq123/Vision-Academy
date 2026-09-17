import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import { injectStore } from '../features/lms/auth/axiosClient.js';
import AppRoutes from './routes.jsx';

injectStore(store);

export default function AppProviders() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
