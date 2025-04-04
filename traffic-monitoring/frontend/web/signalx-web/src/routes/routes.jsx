import { createBrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import Dashboard from '../pages/Dashboard';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    }
]);