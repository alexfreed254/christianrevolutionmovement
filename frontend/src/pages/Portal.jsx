import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Calendar, Heart, DollarSign, Award, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

const Portal = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load profile');
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
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-2">Member ID: {user?.unique_id}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold">{user?.engagement_score || 0}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Engagement Score</h3>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold">{user?.streak || 0}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Day Streak</h3>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold">0</span>
            </div>
            <h3 className="text-gray-600 font-medium">Services Attended</h3>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-semibold uppercase">{user?.growth_stage?.replace('_', ' ')}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Growth Stage</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/live')}
            className="bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl p-8 text-left hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <Calendar className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Check In</h3>
            <p className="text-red-100">Mark your attendance for today's service</p>
          </button>

          <button
            onClick={() => navigate('/prayer-wall')}
            className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl p-8 text-left hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <Heart className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Prayer Wall</h3>
            <p className="text-purple-100">Share or pray for others' requests</p>
          </button>

          <button
            onClick={() => navigate('/give')}
            className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl p-8 text-left hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <DollarSign className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Give</h3>
            <p className="text-green-100">Support the ministry financially</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Portal;
