import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Download, Filter } from 'lucide-react';

const trafficData = [
  { hour: '00:00', vehicles: 120, congestion: 20 },
  { hour: '04:00', vehicles: 80, congestion: 15 },
  { hour: '08:00', vehicles: 300, congestion: 75 },
  { hour: '12:00', vehicles: 250, congestion: 60 },
  { hour: '16:00', vehicles: 400, congestion: 90 },
  { hour: '20:00', vehicles: 200, congestion: 45 },
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Traffic Analytics</h2>
        <div className="flex gap-4">
          <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Last 24 Hours</span>
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-6">Traffic Flow Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="vehicles"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="congestion"
                    stroke="#EF4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-6">Hourly Vehicle Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="vehicles" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Key Metrics</h3>
            <div className="space-y-4">
              {[
                { label: 'Average Daily Traffic', value: '12,450', change: '+8%' },
                { label: 'Peak Hour Volume', value: '1,200', change: '+15%' },
                { label: 'Average Speed', value: '45 km/h', change: '-5%' },
                { label: 'Congestion Index', value: '6.8', change: '+2%' },
              ].map((metric, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">{metric.label}</span>
                    <div className="text-right">
                      <span className="block font-medium">{metric.value}</span>
                      <span className={`text-sm ${
                        metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Traffic Patterns</h3>
            <div className="space-y-3">
              {[
                { time: 'Morning Peak', hours: '8:00 - 10:00', status: 'High' },
                { time: 'Afternoon', hours: '12:00 - 14:00', status: 'Medium' },
                { time: 'Evening Peak', hours: '17:00 - 19:00', status: 'Critical' },
                { time: 'Night', hours: '22:00 - 05:00', status: 'Low' },
              ].map((pattern, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{pattern.time}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      pattern.status === 'Critical' ? 'bg-red-500' :
                      pattern.status === 'High' ? 'bg-orange-500' :
                      pattern.status === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}>
                      {pattern.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{pattern.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;