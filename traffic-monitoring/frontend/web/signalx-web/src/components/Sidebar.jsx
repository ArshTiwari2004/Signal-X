import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Activity, 
  Camera, 
  AlertTriangle,
  Settings,
  BarChart3,
  ChevronRight,
  LogOut,
  User,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  
  const navCategories = [
    {
      name: "Main",
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/results', badge: null },
        { icon: Map, label: 'Traffic Map', path: '/trafficmap', badge: null },
        { icon: Activity, label: 'Live Monitoring', path: '/signal-control', badge: { count: '2', color: 'bg-green-500' } },
        { icon: Camera, label: 'CCTV Feeds', path: '/cctv', badge: null },
        { icon: User, label: 'Track', path: '/emergency-vehicle-tracker', badge: { count: '1', color: 'bg-red-500' } },
      ]
    },
    {
      name: "Management",
      items: [
        { icon: AlertTriangle, label: 'Alerts', path: '/alerts', badge: { count: '3', color: 'bg-red-500' } },
        { icon: BarChart3, label: 'Analytics', path: '/analytics', badge: null },
        { icon: Settings, label: 'Settings', path: '/settings', badge: null },
      ]
    }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`h-100% ${collapsed ? 'w-20' : 'w-72'} bg-gray-900 text-white p-4 flex flex-col transition-all duration-300 shadow-xl relative`}>
      {/* Toggle button */}
      <button 
        className="absolute -right-3 top-8 bg-blue-600 rounded-full p-1 shadow-lg text-white border-2 border-gray-800"
        onClick={toggleSidebar}
      >
        {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
      </button>
      
      {/* Logo */}
      <div 
        className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} mb-10 cursor-pointer`} 
        onClick={() => window.location.href = '/'}
      >
        <div className="bg-blue-600 p-2 rounded-lg">
          <Map className="w-6 h-6 text-white" />
        </div>
        {!collapsed && <h1 className="text-xl font-bold tracking-tight">Signal-X</h1>}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {navCategories.map((category, categoryIndex) => (
          <div key={category.name} className="mb-6">
            {!collapsed && (
              <h2 className="text-xs uppercase text-gray-500 font-semibold mb-2 px-3">
                {category.name}
              </h2>
            )}
            
            {category.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-3 my-1 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md'
                      : 'text-gray-400 hover:bg-gray-800'
                  }`
                }
                onClick={() => setActiveCategoryIndex(categoryIndex)}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </div>
                
                {!collapsed && item.badge && (
                  <span className={`px-2 py-1 rounded-full text-xs ${item.badge.color} text-white font-medium`}>
                    {item.badge.count}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      
      {/* User section */}
      <div className={`mt-auto pt-4 border-t border-gray-800 ${collapsed ? 'items-center justify-center' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div className="flex-1">
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-gray-500">Traffic Admin</p>
            </div>
            <LogOut className="w-5 h-5 text-gray-500" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
              JD
            </div>
            <HelpCircle className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-300" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;