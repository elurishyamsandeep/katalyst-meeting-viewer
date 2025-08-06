'use client';

import { useAuth } from '../../contexts/AuthContext';
import { Bell, Search, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, logout } = useAuth();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowSettingsDropdown(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo Only */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Katalyst AI
              </h1>
              <p className="text-xs text-gray-400 font-light -mt-1">
                assignment
              </p>
            </div>
          </div>

          {/* Right Side - Search, Notifications, Settings, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search meetings..."
                  className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings with Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Settings Dropdown */}
              {showSettingsDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile - UPDATED: Removed "Free Plan" */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user?.name}
                  className="w-8 h-8 rounded-full ring-2 ring-blue-100"
                  referrerPolicy="no-referrer"
                  onLoad={() => console.log('Profile image loaded successfully')}
                  onError={(e) => {
                    console.error('Profile image failed to load:', {
                      src: user.picture,
                      error: e
                    });
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) {
                      (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full ring-2 ring-blue-100 bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              
              {/* Fallback avatar with initials */}
              <div 
                className="w-8 h-8 rounded-full ring-2 ring-blue-100 bg-blue-600 flex items-center justify-center text-white text-sm font-medium" 
                style={{ display: 'none' }}
              >
                {user?.name?.split(' ').map(n => n.charAt(0)).join('').substring(0, 2) || 'U'}
              </div>
              
              {/* Updated User Info Section - Removed "Free Plan" */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                {/* Removed the "Free Plan" line */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showSettingsDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSettingsDropdown(false)}
        ></div>
      )}
    </header>
  );
}
