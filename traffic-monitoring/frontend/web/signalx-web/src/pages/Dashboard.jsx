import React from 'react';
import { Activity, AlertTriangle, Car, MapPin, TrendingUp, Clock, FileBarChart, Bell, Settings, Menu, ChevronDown, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';

const mockData = [
  { time: '00:00', vehicles: 120, emergency: 1 },
  { time: '04:00', vehicles: 80, emergency: 0 },
  { time: '08:00', vehicles: 300, emergency: 2 },
  { time: '12:00', vehicles: 250, emergency: 1 },
  { time: '16:00', vehicles: 400, emergency: 3 },
  { time: '20:00', vehicles: 200, emergency: 1 },
];

const trafficPoints = [
  { id: 1, name: 'Railway Station Road', status: 'critical', vehicles: 245, congestion: 87 },
  { id: 2, name: 'Tilwara Ghat', status: 'warning', vehicles: 178, congestion: 65 },
  { id: 3, name: 'Shakti Nagar', status: 'normal', vehicles: 92, congestion: 34 },
];

const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // Here you would fetch new data in a real application
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Dashboard Header with Refresh Button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Traffic Data</h2>
              <p className="text-gray-400 text-sm">Real-time monitoring of traffic situations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">{lastUpdated.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleRefresh} 
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white p-2 rounded-lg transition flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Refresh</span>
            </button>
          </div>
        </div>
        
        {/* Dashboard Metrics Cards with improved styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500/50 transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Vehicles</p>
                <h3 className="text-2xl font-bold text-white mt-1">1,234</h3>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg group-hover:bg-blue-500/30 transition">
                <Car className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm">↑ 12% increase from yesterday</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-green-500/50 transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Signals</p>
                <h3 className="text-2xl font-bold text-white mt-1">42</h3>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg group-hover:bg-green-500/30 transition">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full" style={{ width: '98%' }}></div>
              </div>
              <span className="text-green-500 text-sm ml-2">98%</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-yellow-500/50 transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Emergency Vehicles</p>
                <h3 className="text-2xl font-bold text-white mt-1">3</h3>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg group-hover:bg-yellow-500/30 transition">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-xs">2 ambulances</span>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-xs">1 fire</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-red-500/50 transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Congestion Points</p>
                <h3 className="text-2xl font-bold text-white mt-1">5</h3>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg group-hover:bg-red-500/30 transition">
                <MapPin className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-xs">3 critical</span>
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-xs">2 warning</span>
            </div>
          </div>
        </div>

        {/* Charts and Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500/50 transition">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Traffic Flow Trend</h3>
              <div className="flex gap-2">
                <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 px-3 py-1 rounded-md text-sm transition">24h</button>
                <button className="text-gray-400 hover:text-gray-300 px-3 py-1 rounded-md text-sm transition">7d</button>
                <button className="text-gray-400 hover:text-gray-300 px-3 py-1 rounded-md text-sm transition">30d</button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                  <Area
                    type="monotone"
                    dataKey="vehicles"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#colorVehicles)"
                    name="Vehicles"
                  />
                  <Area
                    type="monotone"
                    dataKey="emergency"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fill="url(#colorEmergency)"
                    name="Emergency"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-yellow-500/50 transition">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
              <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-md p-1 transition">
                <FileBarChart className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: 'High Congestion',
                  location: 'Main Street Junction',
                  time: '2 mins ago',
                  severity: 'high',
                },
                {
                  title: 'Emergency Vehicle',
                  location: 'Central Avenue',
                  time: '5 mins ago',
                  severity: 'medium',
                },
                {
                  title: 'Signal Malfunction',
                  location: 'West Bridge',
                  time: '10 mins ago',
                  severity: 'low',
                },
              ].map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition cursor-pointer border border-gray-700 hover:border-blue-500/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-10 rounded ${
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <h4 className="text-white font-medium">{alert.title}</h4>
                      <p className="text-gray-400 text-xs">{alert.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        alert.severity === 'high'
                          ? 'bg-red-500/20 text-red-500'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-green-500/20 text-green-500'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 text-blue-400 hover:text-blue-300 text-sm transition">
                View all alerts
              </button>
            </div>
          </div>
        </div>

        {/* Traffic Points Table */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500/50 transition">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Critical Congestion Points</h3>
            <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 px-3 py-1 rounded-md text-sm transition">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider rounded-tl-lg">Location</th>
                  <th className="px-4 py-3 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicles</th>
                  <th className="px-4 py-3 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Congestion</th>
                  <th className="px-4 py-3 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {trafficPoints.map((point, index) => (
                  <tr key={point.id} className={`hover:bg-gray-700 transition ${index === trafficPoints.length - 1 ? 'rounded-b-lg' : ''}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{point.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        point.status === 'critical' ? 'bg-red-500/20 text-red-500' :
                        point.status === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {point.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{point.vehicles}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-700 h-2 rounded-full mr-2">
                          <div 
                            className={`h-full rounded-full ${
                              point.congestion > 80 ? 'bg-red-500' :
                              point.congestion > 50 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`} 
                            style={{ width: `${point.congestion}%` }}>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{point.congestion}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button className="text-blue-500 hover:text-blue-400 transition font-medium">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-gray-400 text-sm">© 2025 Traffic Operations Center. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition text-sm">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;