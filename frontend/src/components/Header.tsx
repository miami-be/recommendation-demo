import React from 'react';
import { Film, Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Film className="h-8 w-8 mr-3 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              MovieMind
              <span className="text-red-500">.</span>
            </h1>
          </div>
          
          <div className="relative w-full sm:w-72 md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search movies or genres..."
              className="bg-blue-800/50 w-full py-2 pl-10 pr-4 rounded-full text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;