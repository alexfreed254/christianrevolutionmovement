import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Portal from './pages/Portal';
import Live from './pages/Live';
import LiveStream from './components/LiveStream';
import Media from './pages/Media';
import Give from './pages/Give';
import Locations from './pages/Locations';
import PrayerWall from './pages/PrayerWall';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/live" element={<Live />} />
          <Route path="/live/:streamId" element={<LiveStream />} />
          <Route path="/media" element={<Media />} />
          <Route path="/give" element={<Give />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/prayer-wall" element={<PrayerWall />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
