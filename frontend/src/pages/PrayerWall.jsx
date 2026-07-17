import React, { useState, useEffect } from 'react';
import { Heart, Send, Loader } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const PrayerWall = () => {
  const [prayers, setPrayers] = useState([]);
  const [newPrayer, setNewPrayer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      const response = await fetch('/api/prayers');
      const data = await response.json();
      setPrayers(data);
    } catch (error) {
      console.error('Error fetching prayers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to submit a prayer request');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/prayers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newPrayer,
          is_public: true
        })
      });

      if (response.ok) {
        toast.success('Prayer request submitted!');
        setNewPrayer('');
        fetchPrayers();
      } else {
        toast.error('Failed to submit prayer');
      }
    } catch (error) {
      console.error('Error submitting prayer:', error);
      toast.error('Failed to submit prayer');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePray = async (prayerId) => {
    try {
      await fetch(`/api/prayers/${prayerId}/pray`, {
        method: 'POST'
      });
      
      setPrayers(prayers.map(p => 
        p.id === prayerId ? { ...p, pray_count: p.pray_count + 1 } : p
      ));
      
      toast.success('🙏 Prayed!');
    } catch (error) {
      console.error('Error praying:', error);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Prayer Wall</h1>
          <p className="text-lg text-gray-600">
            Share your prayer requests and intercede for others
          </p>
        </div>

        {/* Submit Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <textarea
              value={newPrayer}
              onChange={(e) => setNewPrayer(e.target.value)}
              placeholder="Share your prayer request..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={submitting || !newPrayer.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Prayer Requests */}
        <div className="space-y-4">
          {prayers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No prayer requests yet. Be the first to share!</p>
            </div>
          ) : (
            prayers.map((prayer) => (
              <div key={prayer.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                      {prayer.members?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {prayer.members?.full_name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(prayer.created_at))} ago
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {prayer.content}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-semibold">
                      {prayer.pray_count} {prayer.pray_count === 1 ? 'person' : 'people'} prayed
                    </span>
                  </div>

                  <button
                    onClick={() => handlePray(prayer.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold"
                  >
                    <span>🙏</span>
                    <span>Pray</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerWall;
