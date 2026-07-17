import React from 'react';
import { MapPin } from 'lucide-react';

const Locations = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Church Locations</h1>
          <p className="text-gray-600">Coming Soon - Find a church near you</p>
        </div>
      </div>
    </div>
  );
};

export default Locations;
