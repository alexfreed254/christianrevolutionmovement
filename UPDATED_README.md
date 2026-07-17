# Christ Revolution Movement - Updated Stack

## 🎯 Technology Stack Upgrades

### Backend
- ✅ **Flask** (replaced FastAPI)
- ✅ **Flask-SocketIO** for real-time WebSocket communication
- ✅ **Flask-JWT-Extended** for authentication
- ✅ **Eventlet** for async support

### Frontend
- ✅ **React 18** with Vite
- ✅ **Tailwind CSS** for modern styling
- ✅ **Framer Motion** for smooth animations
- ✅ **Socket.IO Client** for real-time features
- ✅ **React Player** for video streaming
- ✅ **Lucide React** for beautiful icons
- ✅ **React Hot Toast** for notifications

### Features Implemented
- ✅ YouTube-style live streaming interface
- ✅ Real-time comments on live streams
- ✅ Live viewer count
- ✅ Reaction animations (👍 ❤️ 🙏 🔥)
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ Smooth page transitions with Framer Motion
- ✅ WebSocket integration for real-time updates

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt

# Set environment variables
cp ../.env.example ../.env
# Edit .env with your Supabase credentials

# Run Flask server
python app.py
```

Server will run on: http://localhost:8000

### 2. Frontend Setup

```bash
# Install Node dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:3000

### 3. Database Setup

1. Go to Supabase SQL Editor
2. Run the complete `database/schema.sql`
3. Verify all tables are created including:
   - live_streams
   - stream_comments
   - stream_reactions

## 📡 Real-Time Features

### WebSocket Events

**Client → Server:**
- `join_stream` - Join a live stream room
- `leave_stream` - Leave a live stream room
- `stream_reaction` - Send a reaction (like, love, pray, fire)

**Server → Client:**
- `new_comment` - Broadcast new comments to all viewers
- `viewer_count_updated` - Update viewer count
- `reaction` - Show reaction animations

### Example Usage

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

// Join stream
socket.emit('join_stream', { stream_id: 'stream-uuid' });

// Listen for new comments
socket.on('new_comment', (comment) => {
  console.log('New comment:', comment);
});

// Send reaction
socket.emit('stream_reaction', {
  stream_id: 'stream-uuid',
  reaction_type: 'love'
});
```

## 🎨 UI Components

### LiveStream Component
- Full-screen video player
- Live chat sidebar
- Real-time comment updates
- Reaction buttons with animations
- Viewer count display
- Like/share functionality

### Features:
- YouTube-style layout
- Auto-scrolling chat
- Floating reaction animations
- Responsive design (works on mobile)
- Dark theme for better video viewing

## 📦 Build for Production

### Build Frontend
```bash
cd frontend
npm run build
```

This creates a `frontend/build` directory that Flask serves in production.

### Run Production Server
```bash
cd backend
gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:8000 app:app
```

## 🌐 API Endpoints

### Live Streaming
- `GET /api/live/streams` - Get all live streams
- `GET /api/live/streams/:id` - Get specific stream
- `GET /api/live/streams/:id/comments` - Get stream comments
- `POST /api/live/streams/:id/comments` - Post a comment (auth required)

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/me` - Get current user (auth required)

### Prayer Wall
- `GET /api/prayers` - Get public prayers
- `POST /api/prayers` - Submit prayer (auth required)
- `POST /api/prayers/:id/pray` - Pray for request

## 🎯 Testing Live Streaming

### 1. Create Test Stream Data

```sql
INSERT INTO live_streams (
  title,
  description,
  stream_url,
  status,
  viewer_count,
  speaker,
  started_at
) VALUES (
  'Sunday Service - Live',
  'Join us for our weekly Sunday service with worship and teaching',
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'live',
  0,
  'Pastor John',
  NOW()
);
```

### 2. Test Stream URL
You can use this free HLS test stream:
```
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
```

### 3. Visit Live Page
- Go to: http://localhost:3000/live
- Click on the live stream
- Test comments, reactions, and real-time features

## 🔧 Environment Variables

```env
# Backend (.env in root)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SESSION_SECRET=your-random-secret-key
ENVIRONMENT=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

## 📱 Mobile Responsive

The entire application is fully responsive:
- ✅ Mobile-first design
- ✅ Touch-friendly buttons
- ✅ Responsive video player
- ✅ Collapsible navigation
- ✅ Optimized for all screen sizes

## 🎨 Customization

### Colors (Tailwind)
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: { ... }, // Red theme
  secondary: { ... } // Green theme
}
```

### Animations
Edit `frontend/src/index.css` for custom animations.

## 🐛 Troubleshooting

### CORS Issues
Make sure `ALLOWED_ORIGINS` includes your frontend URL:
```python
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*').split(',')
```

### WebSocket Connection Failed
1. Check Flask-SocketIO is running
2. Verify port 8000 is not blocked
3. Check browser console for errors

### Video Not Playing
1. Verify stream URL is valid HLS (.m3u8)
2. Check browser supports HLS
3. Try the test stream URL provided above

## 📚 Additional Resources

- **Flask-SocketIO**: https://flask-socketio.readthedocs.io/
- **React Player**: https://github.com/cookpete/react-player
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

## 🎉 What's New

1. **Real-time Live Streaming** - YouTube-style interface with live chat
2. **Modern UI** - Tailwind CSS with smooth animations
3. **WebSocket Integration** - Real-time comments and reactions
4. **React Frontend** - Modern, fast, and responsive
5. **Better UX** - Smooth transitions, loading states, toast notifications
6. **Mobile Optimized** - Works perfectly on all devices

---

**Ready to deploy?** See DEPLOYMENT.md for Render deployment instructions.

Built with ❤️ for the Kingdom | CRM 2033
