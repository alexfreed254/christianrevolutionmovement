import React from 'react';
import { PlayCircle } from 'lucide-react';

const Media = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
          <p className="text-gray-600">Coming Soon - Watch past sermons and teachings</p>
        </div>
      </div>
    </div>
  );
};

export default Media;
