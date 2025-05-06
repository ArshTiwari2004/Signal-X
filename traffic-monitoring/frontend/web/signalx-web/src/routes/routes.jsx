import {createBrowserRouter} from 'react-router-dom';
import Home from '../components/Home';
import DashboardLayout from '../layout/Layout';
import TrafficResults from '../pages/Results';
import CCTVFeeds from '../pages/CCTVFeed';
import TrafficDetection from '../pages/Traffic';
import TrafficMap from '../pages/Trafficmap';
import SignalControlPanel from '../pages/SignalControl';
import EmergencyVehicleTracker from '../pages/EmergencyVehicleTracker';
import Settings from '../pages/Settings';
import Analytics from '../pages/Analytics';
import Alerts from '../pages/Alerts';
import Places from '../pages/Vehicles';

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Home/>,
    },
    {
        element:<DashboardLayout/>,
        children:[
            {
                path:"/results",
                element:<TrafficResults/>,
            },
            {
                path:"/cctv",
                element:<CCTVFeeds/>,
            },
            {
                path:"/traffic-detection",
                element:<TrafficDetection/>,
            },
            {
                path:"/trafficmap",
                element:<TrafficMap/>,
            },
            {
                path:"/signal-control",
                element:<SignalControlPanel/>,
            },
            {
                path:"/Alerts",
                element:<Alerts/>,
            },
            {
                path:"/Analytics",
                element:<Analytics/>,
            },
            {
                path:"/emergency-vehicle-tracker",
                element:<EmergencyVehicleTracker/>,
            },
            {
                path:"/Settings",
                element:<Settings/>,
            },
            {
                path:"/Vehicles",
                element:<Places/>,
            },
            
            
        ]
    }
])