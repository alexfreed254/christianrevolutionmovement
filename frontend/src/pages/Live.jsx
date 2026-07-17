import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Radio, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Live = () => {
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveStreams();
  }, []);

  const fetchLiveStreams = async () => {
    try {
      const response = await fetch('/api/live/streams');
      const data = await response.json();
      setLiveStreams(data);
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Streaming</h1>
          <p className="text-lg text-gray-600">
            Join thousands watching live services from around the world
          </p>
        </div>

        {/* Live Now Section */}
        {liveStreams.filter(s => s.status === 'live').length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-gray-900">Live Now</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveStreams
                .filter(stream => stream.status === 'live')
                .map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/live/${stream.id}`}
                      className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-gray-900">
                        <img
                          src={stream.thumbnail_url || '/placeholder-stream.jpg'}
                          alt={stream.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Live Badge */}
                        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                          <Radio className="w-4 h-4 animate-pulse" />
                          <span className="text-sm font-bold">LIVE</span>
                        </div>

                        {/* Viewer Count */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            {(stream.viewer_count || 0).toLocaleString()}
                          </span>
                        </div>

                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <Radio className="w-8 h-8 text-red-600" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                          {stream.title}
                        </h3>
                        
                        {stream.speaker && (
                          <p className="text-sm text-gray-600 mb-2">
                            Speaker: <span className="font-semibold">{stream.speaker}</span>
                          </p>
                        )}
                        
                        {stream.description && (
                          <p className="text-gray-600 line-clamp-2 mb-3">
                            {stream.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{(stream.viewer_count || 0).toLocaleString()} watching</span>
                            </span>
                          </div>
                          {stream.started_at && (
                            <span>Started {formatDistanceToNow(new Date(stream.started_at))} ago</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Upcoming Streams */}
        {liveStreams.filter(s => s.status === 'scheduled').length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Services</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveStreams
                .filter(stream => stream.status === 'scheduled')
                .map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300">
                      <img
                        src={stream.thumbnail_url || '/placeholder-stream.jpg'}
                        alt={stream.title}
                        className="w-full h-full object-cover"
                      />
                      
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Upcoming
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {stream.title}
                      </h3>
                      
                      {stream.speaker && (
                        <p className="text-sm text-gray-600 mb-3">
                          Speaker: {stream.speaker}
                        </p>
                      )}

                      {stream.scheduled_for && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(stream.scheduled_for).toLocaleDateString()}</span>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{new Date(stream.scheduled_for).toLocaleTimeString()}</span>
                        </div>
                      )}

                      <button className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                        Set Reminder
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* No Streams */}
        {liveStreams.length === 0 && (
          <div className="text-center py-20">
            <Radio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Live Streams</h3>
            <p className="text-gray-600 mb-6">Check back soon for upcoming services</p>
            <Link
              to="/media"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Watch Previous Services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Live;
