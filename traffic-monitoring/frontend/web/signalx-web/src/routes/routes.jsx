import { createBrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../layout/layout';
import TrafficMap from '../pages/Trafficmap';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        element: <DashboardLayout />,
        children: [
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/trafficmap",
                element: <TrafficMap />,
            }
]}
]);