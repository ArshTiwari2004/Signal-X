import React, { useState } from 'react';
import { AlertTriangle, Bell, Filter, CheckCircle, ArrowUp, ArrowDown, ChevronRight, Clock, MapPin, X, Search } from 'lucide-react';

const Alerts = () => {
  const [filter, setFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filters = ['all', 'critical', 'emergency', 'warning', 'resolved'];
  
  const alertData = [
    {
      title: 'High Traffic Congestion',
      location: 'Main Street Junction',
      time: '2 mins ago',
      type: 'critical',
      description: 'Traffic density exceeding normal threshold by 150%',
      id: 'alert-001',
      isNew: true,
    },
    {
      title: 'Emergency Vehicle Approaching',
      location: 'North Avenue',
      time: '5 mins ago',
      type: 'emergency',
      description: 'Ambulance requesting priority signal clearance',
      id: 'alert-002',
      isNew: true,
    },
    {
      title: 'Signal Malfunction',
      location: 'West Bridge',
      time: '10 mins ago',
      type: 'warning',
      description: 'Timer synchronization issue detected',
      id: 'alert-003',
      isNew: false,
    },
    {
      title: 'Camera Feed Disruption',
      location: 'East Junction',
      time: '15 mins ago',
      type: 'warning',
      description: 'Camera 3 experiencing connectivity issues',
      id: 'alert-004',
      isNew: false,
    },
    {
      title: 'Pedestrian Signal Outage',
      location: 'Downtown Crossing',
      time: '23 mins ago',
      type: 'critical',
      description: 'Pedestrian crossing signal inoperative at high-traffic intersection',
      id: 'alert-005',
      isNew: true,
    },
  ];
  
  const filteredAlerts = filter === 'all' 
    ? alertData 
    : alertData.filter(alert => alert.type === filter);
    
  const searchedAlerts = searchQuery 
    ? filteredAlerts.filter(alert => 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredAlerts;
    
  const newAlertsCount = alertData.filter(alert => alert.isNew).length;
  
  const getTypeColor = (type) => {
    switch(type) {
      case 'critical': return 'text-red-500';
      case 'emergency': return 'text-orange-500';
      case 'warning': return 'text-yellow-500';
      case 'resolved': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };
  
  const getBgTypeColor = (type) => {
    switch(type) {
      case 'critical': return 'bg-red-500';
      case 'emergency': return 'bg-orange-500';
      case 'warning': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with active filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            System Alerts
            {newAlertsCount > 0 && (
              <span className="text-sm bg-red-500 text-white px-2 py-1 rounded-full font-medium">
                {newAlertsCount} new
              </span>
            )}
          </h2>
          <p className="text-gray-400 mt-1">Monitor and manage all system notifications</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <button 
              className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg border border-gray-700"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter className="w-4 h-4" />
              <span className="capitalize">{filter} Alerts</span>
              {showFilterMenu ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            </button>
            
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10">
                {filters.map((filterType) => (
                  <button
                    key={filterType}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2 ${filter === filterType ? 'bg-gray-700' : ''}`}
                    onClick={() => {
                      setFilter(filterType);
                      setShowFilterMenu(false);
                    }}
                  >
                    <span className={`w-2 h-2 rounded-full ${getBgTypeColor(filterType)}`}></span>
                    <span className="capitalize">{filterType} Alerts</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
            <Bell className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Recent Alerts</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search alerts..."
                  className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-2.5" 
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
            </div>
            
            {searchedAlerts.length === 0 ? (
              <div className="bg-gray-700 p-8 rounded-lg text-center">
                <p className="text-gray-400">No alerts found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchedAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`bg-gray-700 p-5 rounded-lg border ${
                      alert.isNew ? 'border-l-4 border-l-' + alert.type + '-500' : 'border-gray-600'
                    } shadow-md transition-transform hover:translate-x-1 hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={`w-5 h-5 ${getTypeColor(alert.type)}`} />
                            <h4 className="font-medium text-lg">{alert.title}</h4>
                            {alert.isNew && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-300">{alert.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-400">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{alert.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{alert.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-600 rounded-full">
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-600 rounded-full">
                          <CheckCircle className="w-5 h-5 text-gray-400 hover:text-green-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {filteredAlerts.length > 5 && (
              <div className="mt-6 text-center">
                <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-blue-400 hover:text-blue-300">
                  View All Alerts
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h3 className="font-semibold mb-6 text-lg">Alert Statistics</h3>
            <div className="space-y-6">
              {[
                { label: 'Critical Alerts', count: 3, color: 'bg-red-500', percentage: 8.1 },
                { label: 'Emergency Alerts', count: 2, color: 'bg-orange-500', percentage: 5.4 },
                { label: 'Warnings', count: 8, color: 'bg-yellow-500', percentage: 21.6 },
                { label: 'Resolved', count: 24, color: 'bg-green-500', percentage: 64.9 },
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`block w-3 h-3 rounded-full ${stat.color}`}></span>
                      <span className="text-gray-300">{stat.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-lg">{stat.count}</span>
                      <span className="text-gray-500 text-sm ml-1">({stat.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.color} transition-all duration-500 ease-out`} 
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">24-Hour Summary</h4>
                <span className="text-sm text-gray-400">Total: 37 alerts</span>
              </div>
              <div className="flex gap-2 mt-4">
                {[...Array(24)].map((_, i) => {
                  const height = Math.floor(Math.random() * 40) + 10;
                  let bgColor = 'bg-gray-600';
                  if (height > 40) bgColor = 'bg-red-500';
                  else if (height > 30) bgColor = 'bg-orange-500';
                  else if (height > 20) bgColor = 'bg-yellow-500';
                  else bgColor = 'bg-blue-500';
                  
                  return (
                    <div key={i} className="flex-1 flex items-end">
                      <div 
                        className={`w-full ${bgColor} rounded-sm`} 
                        style={{ height: `${height}px` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">00:00</span>
                <span className="text-xs text-gray-500">12:00</span>
                <span className="text-xs text-gray-500">23:59</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h3 className="font-semibold mb-4 text-lg">Notification Settings</h3>
            <div className="space-y-3">
              {[
                { name: 'Critical Alerts', isEnabled: true, isRequired: true },
                { name: 'Emergency Vehicles', isEnabled: true, isRequired: false },
                { name: 'System Malfunctions', isEnabled: true, isRequired: false },
                { name: 'Traffic Congestion', isEnabled: false, isRequired: false },
                { name: 'Camera Status', isEnabled: true, isRequired: false },
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-650 transition-colors">
                  <div>
                    <span className="font-medium">{setting.name}</span>
                    {setting.isRequired && (
                      <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      defaultChecked={setting.isEnabled} 
                      disabled={setting.isRequired}
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
              
              <button className="w-full mt-4 bg-transparent hover:bg-gray-700 border border-gray-600 text-gray-300 font-medium py-2 rounded-lg">
                Advanced Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;