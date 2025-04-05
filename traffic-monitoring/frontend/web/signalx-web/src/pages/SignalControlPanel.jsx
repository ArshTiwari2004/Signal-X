
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function SignalControlPanel() {
  // Current signal states
  const [signals, setSignals] = useState({
    1: { color: 'red', duration: 30 },
    2: { color: 'red', duration: 30 },
    3: { color: 'red', duration: 30 },
    4: { color: 'green', duration: 30 }
  });

  // Emergency override
  const [emergencyOverride, setEmergencyOverride] = useState(false);
  const [overrideLane, setOverrideLane] = useState(null);
  const [manualMode, setManualMode] = useState(false);

  // Connect to backend WebSocket
//   useEffect(() => {
//     const ws = new WebSocket('ws://your-backend:port/signal-control');

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.type === 'signal_update') {
//         setSignals(prev => ({
//           ...prev,
//           [data.lane]: {
//             color: data.color,
//             duration: data.duration
//           }
//         }));
//       }
//     };

//     return () => ws.close();
//   }, []);

  const handleSignalChange = (lane, color) => {
    // Send command to backend
    fetch('/api/signal-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lane, color })
    })
    .then(() => {
      setSignals(prev => ({
        ...prev,
        [lane]: { ...prev[lane], color }
      }));
      toast.success(`Lane ${lane} set to ${color}`);
    })
    .catch(() => toast.error('Failed to update signal'));
  };

  const activateEmergencyRoute = (lane) => {
    setEmergencyOverride(true);
    setOverrideLane(lane);
    // Turn all signals red except the emergency lane
    Object.keys(signals).forEach(l => {
      handleSignalChange(l, l === lane ? 'green' : 'red');
    });
    toast.warning(`Emergency route activated for Lane ${lane}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Signal Control Panel</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setManualMode(!manualMode)}
            className={`px-4 py-2 rounded-md ${
              manualMode 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {manualMode ? 'Manual Mode (ON)' : 'Manual Mode'}
          </button>
          <button
            onClick={() => {
              setEmergencyOverride(false);
              setOverrideLane(null);
              toast.info('Emergency override cancelled');
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md"
            disabled={!emergencyOverride}
          >
            Cancel Emergency
          </button>
        </div>
      </div>

      {emergencyOverride && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-red-800">
              EMERGENCY OVERRIDE ACTIVE (Lane {overrideLane} prioritized)
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(lane => (
          <div 
            key={lane} 
            className={`p-4 rounded-lg border-2 ${
              signals[lane].color === 'green' 
                ? 'bg-green-50 border-green-300' 
                : signals[lane].color === 'yellow' 
                  ? 'bg-yellow-50 border-yellow-300' 
                  : 'bg-red-50 border-red-300'
            } ${
              emergencyOverride && overrideLane === lane.toString() 
                ? 'ring-2 ring-blue-500' 
                : ''
            }`}
          >
            <h3 className="text-lg font-semibold mb-3 text-center">Lane {lane}</h3>
            
            {/* Signal Indicator */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 rounded-full mb-2 flex items-center justify-center border-4 border-gray-800">
                <div 
                  className={`w-16 h-16 rounded-full ${
                    signals[lane].color === 'green' 
                      ? 'bg-green-500' 
                      : signals[lane].color === 'yellow' 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                  }`}
                ></div>
              </div>
              <span className="text-sm">
                {signals[lane].duration}s remaining
              </span>
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSignalChange(lane, 'red')}
                className={`py-1 text-xs rounded ${
                  signals[lane].color === 'red' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200'
                }`}
                disabled={!manualMode && !emergencyOverride}
              >
                Red
              </button>
              <button
                onClick={() => handleSignalChange(lane, 'yellow')}
                className={`py-1 text-xs rounded ${
                  signals[lane].color === 'yellow' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200'
                }`}
                disabled={!manualMode && !emergencyOverride}
              >
                Yellow
              </button>
              <button
                onClick={() => handleSignalChange(lane, 'green')}
                className={`py-1 text-xs rounded ${
                  signals[lane].color === 'green' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200'
                }`}
                disabled={!manualMode && !emergencyOverride}
              >
                Green
              </button>
            </div>

            {/* Emergency Priority */}
            <button
              onClick={() => activateEmergencyRoute(lane.toString())}
              className={`mt-3 w-full py-1 text-xs rounded ${
                emergencyOverride && overrideLane === lane.toString() 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200'
              }`}
              disabled={emergencyOverride}
            >
              {emergencyOverride && overrideLane === lane.toString() 
                ? 'Active Priority' 
                : 'Set Emergency Priority'}
            </button>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={`h-3 w-3 rounded-full mr-2 ${
              manualMode || emergencyOverride 
                ? 'bg-yellow-500' 
                : 'bg-green-500'
            }`}></span>
            <span className="text-sm">
              {manualMode 
                ? 'Manual Control Active' 
                : emergencyOverride 
                  ? 'Emergency Override Active' 
                  : 'Automatic Mode'}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}