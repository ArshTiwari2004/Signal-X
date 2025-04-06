import { useState, useEffect } from 'react';
import { FaAmbulance, FaFire, FaShieldAlt, FaClock } from 'react-icons/fa';

export default function EmergencyVehicleTracker() {
  // Sample emergency vehicles data - replace with real API data
  const [emergencyVehicles, setEmergencyVehicles] = useState([
    {
      id: 'AMB-1023',
      type: 'ambulance',
      distance: 1.2, // km
      eta: 2.5, // minutes
      location: 'MG Road Crossing',
      status: 'approaching',
      priority: 'high'
    },
    {
      id: 'FIR-4567',
      type: 'fire_truck',
      distance: 3.8,
      eta: 6.2,
      location: 'Central Circle',
      status: 'en_route',
      priority: 'medium'
    }
  ]);

  // Connect to WebSocket for real-time updates
//   useEffect(() => {
//     // Mock WebSocket connection - replace with actual connection
//     const ws = new WebSocket('ws://your-backend:port/emergency-tracking');

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setEmergencyVehicles(prev => 
//         [...prev.filter(v => v.id !== data.id), data]
//           .sort((a, b) => a.eta - b.eta)
//       );
//     };

//     return () => ws.close();
//   }, []);

  const getVehicleIcon = (type) => {
    switch(type) {
      case 'ambulance': return <FaAmbulance className="text-red-500" />;
      case 'fire_truck': return <FaFire className="text-orange-500" />;
      default: return <FaShieldAlt className="text-blue-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${styles[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-800 text-white p-4">
        <h2 className="text-xl font-bold flex items-center">
          <FaShieldAlt className="mr-2" />
          Emergency Vehicle Tracker
        </h2>
        <p className="text-sm opacity-80">Real-time tracking of approaching emergency vehicles</p>
      </div>

      <div className="divide-y divide-gray-200">
        {emergencyVehicles.length > 0 ? (
          emergencyVehicles.map(vehicle => (
            <div key={vehicle.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl mt-1">
                    {getVehicleIcon(vehicle.type)}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {vehicle.id} 
                      <span className="ml-2 text-sm text-gray-500">
                        {vehicle.type.replace('_', ' ')}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600">{vehicle.location}</p>
                  </div>
                </div>
                {getPriorityBadge(vehicle.priority)}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center text-sm">
                  <FaClock className="mr-2 text-gray-400" />
                  <span>
                    <span className="font-medium">{vehicle.eta.toFixed(1)} min</span> ETA
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{vehicle.distance.toFixed(1)} km</span> away
                </div>
              </div>

              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    vehicle.priority === 'high' 
                      ? 'bg-red-500' 
                      : vehicle.priority === 'medium' 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, 100 - (vehicle.distance / 5 * 100))}%` 
                  }}
                ></div>
              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Approaching</span>
                <span>At junction</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No emergency vehicles approaching</p>
            <p className="text-sm mt-1">System will alert when detected</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <button 
            className="text-blue-600 hover:text-blue-800"
            onClick={() => {
              // Refresh data
              console.log("Refreshing emergency vehicle data");
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}