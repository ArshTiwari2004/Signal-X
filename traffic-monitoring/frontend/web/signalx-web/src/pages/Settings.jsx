import React from 'react';
import { Save, Bell, Shield, Database, Monitor, Map, Camera } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Settings</h2>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold">Camera Configuration</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Video Quality', options: ['720p', '1080p', '4K'] },
                { label: 'Frame Rate', options: ['24 fps', '30 fps', '60 fps'] },
                { label: 'Night Mode', options: ['Auto', 'Always On', 'Scheduled'] },
                { label: 'Motion Detection', options: ['High', 'Medium', 'Low'] },
              ].map((setting, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-gray-400">{setting.label}</label>
                  <select className="col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2">
                    {setting.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Map className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold">Map Settings</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Default View', options: ['Satellite', 'Traffic', 'Terrain'] },
                { label: 'Update Interval', options: ['5 sec', '10 sec', '30 sec'] },
                { label: 'Traffic Layer', options: ['Always On', 'Auto', 'Off'] },
                { label: 'Heatmap Style', options: ['Classic', 'Modern', 'High Contrast'] },
              ].map((setting, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-gray-400">{setting.label}</label>
                  <select className="col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2">
                    {setting.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-yellow-500" />
              <h3 className="font-semibold">Notification Settings</h3>
            </div>
            <div className="space-y-3">
              {[
                'Emergency Alerts',
                'System Updates',
                'Traffic Anomalies',
                'Camera Status',
                'Performance Reports',
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <span>{setting}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-red-500" />
              <h3 className="font-semibold">Security Settings</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Access Level', options: ['Admin', 'Operator', 'Viewer'] },
                { label: 'Session Timeout', options: ['15 min', '30 min', '1 hour'] },
                { label: '2FA', options: ['Enabled', 'Disabled'] },
                { label: 'API Access', options: ['Full', 'Limited', 'None'] },
              ].map((setting, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-gray-400">{setting.label}</label>
                  <select className="col-span-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2">
                    {setting.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;