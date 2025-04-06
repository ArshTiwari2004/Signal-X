import { createBrowserRouter } from 'react-router-dom';
import Home from '../components/Home';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../layout/Layout';
import TrafficMap from '../pages/Trafficmap';
import Monitoring from '../pages/Livemonitoring';
import LiveMonitoring from '../pages/Livemonitoring';
import CCTVFeeds from '../pages/CCTVFeeds';
import Analytics from '../pages/Analytics';
import Alerts from '../pages/Alerts';
import Settings from '../pages/Settings';
import Results from '../pages/Results';
import SignalControlPanel from '../pages/SignalControlPanel';
import EmergencyVehicleTracker from '../pages/EmergencyVehicleTracker';

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
            },
            {
                path: "/monitoring",
                element: <LiveMonitoring />,
            },
            {
                path: "/cctv",
                element: <CCTVFeeds />,
            },
            {
                path: "/analytics",
                element: <Analytics />,
            },
            {
                path: "/alerts",
                element: <Alerts />,
            },
            {
                path: "/settings",
                element: <Settings />,
            },
            {
                path: "/results",
                element: <Results />,

            },
            {
                path: "/signal-control",
                element: <SignalControlPanel />,
            },
            {
                path: "/emergency-vehicle-tracker",
                element: <EmergencyVehicleTracker />,
            }

]}
]);
