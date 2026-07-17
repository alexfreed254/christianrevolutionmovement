"""
Christ Revolution Movement (CRM) — Flask API with Real-time Features
Modern REST API with WebSocket support for live streaming and comments
"""

# CRITICAL: Eventlet monkey patching MUST be ABSOLUTE FIRST
# Do NOT import ANYTHING before this
import eventlet
eventlet.monkey_patch()

# Now safe to import everything else
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import datetime, timedelta
from typing import Optional
import os
import secrets
from pathlib import Path

# Import supabase client (no Flask context needed)
from supabase_client import supabase

# Import auth utilities (do NOT import anything that uses Flask context at module level)
from auth import hash_password, verify_password, generate_unique_id

# Initialize Flask app
app = Flask(__name__, 
            static_folder='../frontend/build',
            template_folder='../frontend/build')

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SESSION_SECRET', secrets.token_hex(32))
app.config['JWT_SECRET_KEY'] = os.environ.get('SESSION_SECRET', secrets.token_hex(32))
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize CORS and SocketIO first
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*').split(',')
CORS(app, origins=ALLOWED_ORIGINS, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins=ALLOWED_ORIGINS, async_mode='eventlet')

# Import JWT utilities AFTER Flask app is created to avoid circular import issues
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

# Initialize JWT AFTER imports
jwt = JWTManager(app)

# ==================== API Routes ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'service': 'CRM Central Command',
        'time': datetime.utcnow().isoformat()
    }), 200

# ==================== Authentication Routes ====================

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new member"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['full_name', 'continent', 'country', 'city', 
                          'email', 'phone', 'username', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check existing username
        existing = supabase.table("members").select("id").eq("username", data['username']).execute()
        if existing.data:
            return jsonify({'error': 'Username already taken'}), 400
        
        # Check existing email
        existing_email = supabase.table("members").select("id").eq("email", data['email']).execute()
        if existing_email.data:
            return jsonify({'error': 'Email already registered'}), 400
        
        # Generate unique ID and hash password
        unique_id = generate_unique_id(data['continent'], data['country'], data['city'])
        password_hash = hash_password(data['password'])
        
        # Create member record
        member = {
            "full_name": data['full_name'],
            "continent": data['continent'],
            "country": data['country'],
            "city": data['city'],
            "village": data.get('village'),
            "email": data['email'],
            "phone": data['phone'],
            "username": data['username'],
            "password_hash": password_hash,
            "unique_id": unique_id,
            "growth_stage": "new_believer",
            "engagement_score": 0,
            "streak": 0,
            "joined_at": datetime.utcnow().isoformat(),
            "preferred_language": "en",
            "timezone": "UTC"
        }
        
        result = supabase.table("members").insert(member).execute()
        member_data = result.data[0]
        member_data.pop('password_hash', None)
        
        # Create JWT token
        token = create_access_token(identity=member_data['id'])
        
        return jsonify({
            'token': token,
            'member': member_data
        }), 201
        
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Login member"""
    try:
        data = request.get_json()
        
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password required'}), 400
        
        # Get member
        result = supabase.table("members").select("*").eq("username", data['username']).execute()
        if not result.data:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        member = result.data[0]
        
        # Verify password
        if not verify_password(data['password'], member['password_hash']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Update last seen
        supabase.table("members").update({
            "last_seen": datetime.utcnow().isoformat()
        }).eq("id", member['id']).execute()
        
        member.pop('password_hash', None)
        token = create_access_token(identity=member['id'])
        
        return jsonify({
            'token': token,
            'member': member
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Login failed'}), 500

@app.route('/api/me', methods=['GET'])
@jwt_required()
def get_me():
    """Get current user info"""
    try:
        member_id = get_jwt_identity()
        result = supabase.table("members").select("*").eq("id", member_id).single().execute()
        member = result.data
        member.pop('password_hash', None)
        return jsonify(member), 200
    except Exception as e:
        print(f"Get me error: {e}")
        return jsonify({'error': 'Failed to get user info'}), 500

# ==================== Attendance Routes ====================

@app.route('/api/attendance', methods=['POST'])
@jwt_required()
def check_in():
    """Check-in to a service"""
    try:
        member_id = get_jwt_identity()
        data = request.get_json()
        
        record = {
            "member_id": member_id,
            "service_type": data.get('service_type', 'sunday'),
            "mode": data.get('mode', 'online'),
            "location_code": data.get('location_code'),
            "attended_at": datetime.utcnow().isoformat()
        }
        
        supabase.table("attendance").insert(record).execute()
        
        # Update engagement score and streak
        member = supabase.table("members").select("engagement_score, streak").eq("id", member_id).single().execute().data
        new_score = (member.get('engagement_score') or 0) + 10
        new_streak = (member.get('streak') or 0) + 1
        
        supabase.table("members").update({
            "engagement_score": new_score,
            "streak": new_streak,
            "last_seen": datetime.utcnow().isoformat()
        }).eq("id", member_id).execute()
        
        return jsonify({
            'status': 'ok',
            'score': new_score,
            'streak': new_streak
        }), 200
        
    except Exception as e:
        print(f"Check-in error: {e}")
        return jsonify({'error': 'Check-in failed'}), 500

# ==================== Prayer Routes ====================

@app.route('/api/prayers', methods=['GET'])
def get_prayers():
    """Get public prayer requests"""
    try:
        result = supabase.table("prayer_requests")\
            .select("*, members!inner(full_name, unique_id)")\
            .eq("is_public", True)\
            .order("created_at", desc=True)\
            .limit(50)\
            .execute()
        return jsonify(result.data), 200
    except Exception as e:
        print(f"Get prayers error: {e}")
        return jsonify({'error': 'Failed to get prayers'}), 500

@app.route('/api/prayers', methods=['POST'])
@jwt_required()
def submit_prayer():
    """Submit a prayer request"""
    try:
        member_id = get_jwt_identity()
        data = request.get_json()
        
        record = {
            "member_id": member_id,
            "content": data.get('content'),
            "is_public": data.get('is_public', True),
            "pray_count": 0,
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("prayer_requests").insert(record).execute()
        return jsonify(result.data), 201
        
    except Exception as e:
        print(f"Submit prayer error: {e}")
        return jsonify({'error': 'Failed to submit prayer'}), 500

@app.route('/api/prayers/<prayer_id>/pray', methods=['POST'])
def pray_for(prayer_id):
    """Pray for a prayer request"""
    try:
        supabase.rpc("increment_pray_count", {"p_id": prayer_id}).execute()
        return jsonify({'status': 'ok'}), 200
    except Exception as e:
        print(f"Pray error: {e}")
        return jsonify({'error': 'Failed to pray'}), 500

# ==================== Live Streaming Routes ====================

@app.route('/api/live/streams', methods=['GET'])
def get_live_streams():
    """Get active live streams"""
    try:
        result = supabase.table("live_streams")\
            .select("*")\
            .eq("status", "live")\
            .order("started_at", desc=True)\
            .execute()
        return jsonify(result.data), 200
    except Exception as e:
        print(f"Get streams error: {e}")
        return jsonify({'error': 'Failed to get streams'}), 500

@app.route('/api/live/streams/<stream_id>', methods=['GET'])
def get_stream(stream_id):
    """Get specific live stream"""
    try:
        result = supabase.table("live_streams")\
            .select("*")\
            .eq("id", stream_id)\
            .single()\
            .execute()
        return jsonify(result.data), 200
    except Exception as e:
        print(f"Get stream error: {e}")
        return jsonify({'error': 'Stream not found'}), 404

@app.route('/api/live/streams/<stream_id>/comments', methods=['GET'])
def get_stream_comments(stream_id):
    """Get comments for a stream"""
    try:
        result = supabase.table("stream_comments")\
            .select("*, members!inner(full_name, unique_id)")\
            .eq("stream_id", stream_id)\
            .order("created_at", desc=True)\
            .limit(100)\
            .execute()
        return jsonify(result.data), 200
    except Exception as e:
        print(f"Get comments error: {e}")
        return jsonify({'error': 'Failed to get comments'}), 500

@app.route('/api/live/streams/<stream_id>/comments', methods=['POST'])
@jwt_required()
def post_stream_comment(stream_id):
    """Post a comment on a stream"""
    try:
        member_id = get_jwt_identity()
        data = request.get_json()
        
        comment = {
            "stream_id": stream_id,
            "member_id": member_id,
            "content": data.get('content'),
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("stream_comments").insert(comment).execute()
        
        # Get member info for real-time broadcast
        member = supabase.table("members").select("full_name, unique_id").eq("id", member_id).single().execute().data
        
        comment_data = result.data[0]
        comment_data['members'] = member
        
        # Broadcast to all connected clients
        socketio.emit('new_comment', comment_data, room=f'stream_{stream_id}')
        
        return jsonify(comment_data), 201
        
    except Exception as e:
        print(f"Post comment error: {e}")
        return jsonify({'error': 'Failed to post comment'}), 500

# ==================== Giving Routes ====================

@app.route('/api/give', methods=['POST'])
@jwt_required()
def record_giving():
    """Record a giving/donation"""
    try:
        member_id = get_jwt_identity()
        data = request.get_json()
        
        import uuid
        record = {
            "member_id": member_id,
            "amount": data.get('amount'),
            "currency": data.get('currency', 'USD'),
            "category": data.get('category', 'tithe'),
            "is_recurring": data.get('is_recurring', False),
            "payment_method": data.get('payment_method', 'card'),
            "receipt_id": f"CRM-{uuid.uuid4().hex[:10].upper()}",
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("giving").insert(record).execute()
        return jsonify(result.data), 201
        
    except Exception as e:
        print(f"Giving error: {e}")
        return jsonify({'error': 'Failed to record giving'}), 500

@app.route('/api/giving/history', methods=['GET'])
@jwt_required()
def giving_history():
    """Get giving history"""
    try:
        member_id = get_jwt_identity()
        result = supabase.table("giving")\
            .select("*")\
            .eq("member_id", member_id)\
            .order("created_at", desc=True)\
            .execute()
        return jsonify(result.data), 200
    except Exception as e:
        print(f"Giving history error: {e}")
        return jsonify({'error': 'Failed to get giving history'}), 500

# ==================== WebSocket Events ====================

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('Client connected')
    emit('connected', {'status': 'connected'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('Client disconnected')

@socketio.on('join_stream')
def handle_join_stream(data):
    """Join a live stream room"""
    stream_id = data.get('stream_id')
    join_room(f'stream_{stream_id}')
    emit('joined_stream', {'stream_id': stream_id})
    
    # Increment viewer count
    try:
        supabase.rpc("increment_viewer_count", {"p_stream_id": stream_id}).execute()
        # Broadcast updated viewer count
        result = supabase.table("live_streams").select("viewer_count").eq("id", stream_id).single().execute()
        socketio.emit('viewer_count_updated', {
            'stream_id': stream_id,
            'viewer_count': result.data.get('viewer_count', 0)
        }, room=f'stream_{stream_id}')
    except Exception as e:
        print(f"Viewer count error: {e}")

@socketio.on('leave_stream')
def handle_leave_stream(data):
    """Leave a live stream room"""
    stream_id = data.get('stream_id')
    leave_room(f'stream_{stream_id}')
    emit('left_stream', {'stream_id': stream_id})
    
    # Decrement viewer count
    try:
        supabase.rpc("decrement_viewer_count", {"p_stream_id": stream_id}).execute()
        result = supabase.table("live_streams").select("viewer_count").eq("id", stream_id).single().execute()
        socketio.emit('viewer_count_updated', {
            'stream_id': stream_id,
            'viewer_count': result.data.get('viewer_count', 0)
        }, room=f'stream_{stream_id}')
    except Exception as e:
        print(f"Viewer count error: {e}")

@socketio.on('stream_reaction')
def handle_stream_reaction(data):
    """Handle reactions (like, love, pray) on stream"""
    stream_id = data.get('stream_id')
    reaction_type = data.get('reaction_type')  # like, love, pray, amen
    
    # Broadcast reaction to all viewers
    socketio.emit('reaction', {
        'stream_id': stream_id,
        'reaction_type': reaction_type,
        'timestamp': datetime.utcnow().isoformat()
    }, room=f'stream_{stream_id}')

# ==================== Frontend Routes ====================

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Serve React frontend"""
    try:
        # Try to serve static files
        if path and path != "":
            static_path = Path(app.static_folder) / path
            if static_path.exists() and static_path.is_file():
                return send_from_directory(app.static_folder, path)
        
        # Serve index.html for all other routes (SPA routing)
        index_path = Path(app.static_folder) / 'index.html'
        if index_path.exists():
            return send_from_directory(app.static_folder, 'index.html')
        else:
            # Frontend not built yet - show helpful message
            return jsonify({
                'error': 'Frontend not built',
                'message': 'React frontend build not found. Run: cd frontend && npm run build',
                'api_status': 'ok',
                'api_docs': '/api/health'
            }), 503
    except Exception as e:
        print(f"Frontend serve error: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== Error Handlers ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# ==================== Run Application ====================

# For gunicorn deployment: gunicorn loads the 'app' object directly
# The socketio object wraps the Flask app and handles WebSocket routing
# DO NOT call socketio.run() when using gunicorn - it conflicts with gunicorn's binding

if __name__ == '__main__':
    # Only for local development (python app.py)
    # Production uses: gunicorn --worker-class eventlet -w 1 app:app
    port = int(os.environ.get('PORT', 8000))
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
