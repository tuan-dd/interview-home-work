import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AccountPage from './pages/AccountPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: '/account',
        element: <AccountPage />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

