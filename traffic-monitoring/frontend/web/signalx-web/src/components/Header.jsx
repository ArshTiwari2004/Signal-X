import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white h-16 px-6 flex items-center justify-between border-b border-gray-800">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Integrated Command and Control center</h2>
        <span className="px-2 py-1 rounded-full bg-green-500 text-xs">Live</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-800 rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <span className="text-sm">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;