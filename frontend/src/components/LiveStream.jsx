import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { io } from 'socket.io-client';
import { 
  Eye, Heart, MessageCircle, Share2, 
  ThumbsUp, Send, Users, Flame 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const LiveStream = () => {
  const { streamId } = useParams();
  const [stream, setStream] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const commentsEndRef = useRef(null);
  const commentInputRef = useRef(null);

  useEffect(() => {
    // Get user from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    }

    // Fetch stream details
    fetchStream();
    fetchComments();

    // Initialize socket connection
    const newSocket = io('http://localhost:8000', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      newSocket.emit('join_stream', { stream_id: streamId });
    });

    newSocket.on('new_comment', (comment) => {
      setComments(prev => [comment, ...prev]);
      scrollToBottom();
    });

    newSocket.on('viewer_count_updated', (data) => {
      setViewerCount(data.viewer_count);
    });

    newSocket.on('reaction', (data) => {
      showReactionAnimation(data.reaction_type);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit('leave_stream', { stream_id: streamId });
        newSocket.disconnect();
      }
    };
  }, [streamId]);

  const fetchCurrentUser = async () => {
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
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchStream = async () => {
    try {
      const response = await fetch(`/api/live/streams/${streamId}`);
      const data = await response.json();
      setStream(data);
      setViewerCount(data.viewer_count || 0);
    } catch (error) {
      console.error('Error fetching stream:', error);
      toast.error('Failed to load stream');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/live/streams/${streamId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) {
      if (!user) toast.error('Please login to comment');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/live/streams/${streamId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (response.ok) {
        setNewComment('');
        commentInputRef.current?.focus();
      } else {
        toast.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const handleReaction = (reactionType) => {
    if (socket) {
      socket.emit('stream_reaction', {
        stream_id: streamId,
        reaction_type: reactionType
      });
    }
  };

  const showReactionAnimation = (type) => {
    const emoji = type === 'like' ? '👍' : type === 'love' ? '❤️' : 
                  type === 'pray' ? '🙏' : '🔥';
    
    const x = Math.random() * window.innerWidth;
    const element = document.createElement('div');
    element.innerHTML = emoji;
    element.className = 'reaction-float';
    element.style.cssText = `
      position: fixed;
      left: ${x}px;
      bottom: 100px;
      font-size: 3rem;
      animation: float-up 3s ease-out forwards;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(element);
    setTimeout(() => element.remove(), 3000);
  };

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!stream) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Video Player Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {stream.status === 'live' && (
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
                  <div className="live-indicator px-3 py-1 bg-red-600 rounded-full flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm font-semibold">LIVE</span>
                  </div>
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {viewerCount.toLocaleString()} watching
                    </span>
                  </div>
                </div>
              )}

              <ReactPlayer
                url={stream.stream_url}
                width="100%"
                height="100%"
                playing
                controls
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload'
                    }
                  }
                }}
              />
            </div>

            {/* Stream Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{stream.title}</h1>
                <div className="flex items-center justify-between text-gray-400 text-sm">
                  <span>{viewerCount.toLocaleString()} viewers</span>
                  {stream.started_at && (
                    <span>Started {formatDistanceToNow(new Date(stream.started_at))} ago</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsLiked(!isLiked);
                    handleReaction('like');
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                    isLiked 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>{(stream.like_count || 0).toLocaleString()}</span>
                </button>

                <button
                  onClick={() => handleReaction('love')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition"
                >
                  <Heart className="w-5 h-5 text-red-500" />
                </button>

                <button
                  onClick={() => handleReaction('pray')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition"
                >
                  <span className="text-xl">🙏</span>
                </button>

                <button
                  onClick={() => handleReaction('fire')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition"
                >
                  <Flame className="w-5 h-5 text-orange-500" />
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition ml-auto">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Description */}
              {stream.description && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{stream.description}</p>
                  {stream.speaker && (
                    <p className="mt-2 text-sm text-gray-400">
                      Speaker: <span className="text-white font-semibold">{stream.speaker}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Live Chat Column */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg h-[calc(100vh-8rem)] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Live Chat</span>
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{viewerCount}</span>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MessageCircle className="w-12 h-12 mb-2" />
                    <p>Be the first to comment!</p>
                  </div>
                ) : (
                  <>
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3 animate-fade-in">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                            {comment.members?.full_name?.charAt(0) || 'U'}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline space-x-2">
                            <span className="font-semibold text-sm text-blue-400">
                              {comment.members?.full_name || 'Unknown'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(comment.created_at))} ago
                            </span>
                          </div>
                          <p className="text-sm text-gray-200 break-words mt-1">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={commentsEndRef} />
                  </>
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSubmitComment} className="flex space-x-2">
                  <input
                    ref={commentInputRef}
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={user ? "Say something..." : "Login to comment"}
                    disabled={!user}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={!user || !newComment.trim()}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for floating reactions */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-500px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveStream;
