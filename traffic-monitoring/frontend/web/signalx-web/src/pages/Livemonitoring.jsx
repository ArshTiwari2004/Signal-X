import React, { useState } from 'react';
import { Activity, AlertCircle, Clock, Radio } from 'lucide-react';

const LiveMonitoring = () => {
  // State for system mode
  const [systemMode, setSystemMode] = useState('Auto Mode');
  
  // State for junctions
  const [junctions, setJunctions] = useState([
    { id: 1, title: 'Junction 1', status: 'Active', mode: 'Auto', activeLight: 'green' },
    { id: 2, title: 'Junction 2', status: 'Active', mode: 'Emergency', activeLight: 'red' },
    { id: 3, title: 'Junction 3', status: 'Active', mode: 'Manual', activeLight: 'yellow' },
    { id: 4, title: 'Junction 4', status: 'Maintenance', mode: 'Off', activeLight: 'none' },
  ]);

  // Signal timing state
  const [signalTiming, setSignalTiming] = useState({
    'North-South': { active: true, remaining: 30, total: 50, progress: 60 },
    'East-West': { active: true, remaining: 30, total: 50, progress: 60 },
  });

  // Handle junction mode change
  const handleJunctionModeChange = (junctionId, newMode) => {
    setJunctions(junctions.map(junction => 
      junction.id === junctionId 
        ? { ...junction, mode: newMode, 
            activeLight: newMode === 'Emergency' ? 'red' : 
                         newMode === 'Manual' ? junction.activeLight : 
                         newMode === 'Auto' ? 'green' : 
                         'none' } 
        : junction
    ));
  };

  // Handle light color change
  const handleLightChange = (junctionId, color) => {
    setJunctions(junctions.map(junction => 
      junction.id === junctionId && junction.mode === 'Manual'
        ? { ...junction, activeLight: color }
        : junction
    ));
  };

  // Handle global mode change
  const handleGlobalModeChange = (event) => {
    const newMode = event.target.value;
    setSystemMode(newMode);
    
    // Update all junctions based on global mode
    const modeMapping = {
      'Auto Mode': 'Auto',
      'Manual Mode': 'Manual',
      'Emergency Mode': 'Emergency'
    };
    
    const newJunctions = junctions.map(junction => ({
      ...junction,
      mode: modeMapping[newMode],
      activeLight: modeMapping[newMode] === 'Emergency' ? 'red' :
                  modeMapping[newMode] === 'Manual' ? junction.activeLight :
                  modeMapping[newMode] === 'Auto' ? 'green' :
                  'none'
    }));
    
    setJunctions(newJunctions);
  };

  return (
    <div className="space-y-6 p-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Monitoring</h2>
        <div className="flex gap-4">
          <select 
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
            value={systemMode}
            onChange={handleGlobalModeChange}
          >
            <option>Auto Mode</option>
            <option>Manual Mode</option>
            <option>Emergency Mode</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {junctions.map((junction) => (
              <div key={junction.id} className="bg-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold">{junction.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    junction.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    {junction.status}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Mode</span>
                    <select 
                      className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                      value={junction.mode}
                      onChange={(e) => handleJunctionModeChange(junction.id, e.target.value)}
                    >
                      <option value="Auto">Auto</option>
                      <option value="Manual">Manual</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      className={`h-8 rounded ${junction.activeLight === 'red' ? 'ring-2 ring-white' : ''} ${junction.mode === 'Manual' ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} bg-red-500`}
                      onClick={() => handleLightChange(junction.id, 'red')}
                      disabled={junction.mode !== 'Manual'}
                    ></button>
                    <button 
                      className={`h-8 rounded ${junction.activeLight === 'yellow' ? 'ring-2 ring-white' : ''} ${junction.mode === 'Manual' ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} bg-yellow-500`}
                      onClick={() => handleLightChange(junction.id, 'yellow')}
                      disabled={junction.mode !== 'Manual'}
                    ></button>
                    <button 
                      className={`h-8 rounded ${junction.activeLight === 'green' ? 'ring-2 ring-white' : ''} ${junction.mode === 'Manual' ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} bg-green-500`}
                      onClick={() => handleLightChange(junction.id, 'green')}
                      disabled={junction.mode !== 'Manual'}
                    ></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Signal Timing Control</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(signalTiming).map(([direction, data]) => (
                <div key={direction} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>{direction}</span>
                    <span className="text-green-500">Active</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${data.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{data.remaining}s remaining</span>
                    <span>{data.total}s total</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">System Status</h3>
            <div className="space-y-4">
              {[
                { icon: Activity, label: 'System Health', status: 'Optimal', color: 'text-green-500' },
                { icon: AlertCircle, label: 'Active Alerts', status: '2 Warnings', color: 'text-yellow-500' },
                { icon: Clock, label: 'Response Time', status: '120ms', color: 'text-blue-500' },
                { icon: Radio, label: 'Signal Strength', status: 'Strong', color: 'text-green-500' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  <span className={item.color}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Emergency Vehicles</h3>
            <div className="space-y-3">
              {[
                { type: 'Ambulance', location: 'North Avenue', eta: '2 mins' },
                { type: 'Fire Truck', location: 'West Bridge', eta: '5 mins' },
              ].map((vehicle, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-red-500">{vehicle.type}</span>
                    <span className="text-sm bg-red-500/20 text-red-500 px-2 py-1 rounded">
                      ETA: {vehicle.eta}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{vehicle.location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;