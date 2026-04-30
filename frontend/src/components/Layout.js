import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'catchy');

  useEffect(() => {
    // Apply theme to body for global variables
    if (theme === 'bw') {
      document.body.classList.add('theme-bw');
    } else {
      document.body.classList.remove('theme-bw');
    }

    // Synchronize theme and user data from localStorage
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem('theme') || 'catchy';
      if (currentTheme !== theme) setTheme(currentTheme);
      
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        setUser(currentUser);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [theme, user]);

  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:5000');

    // Join the room for this user ID
    socket.emit('join', user.id);

    // Listen for generic notifications
    socket.on('notify', (message) => {
      toast(message, {
        icon: '🔔',
        style: {
          borderRadius: '12px',
          background: '#09090b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden font-sans text-slate-200">
      {/* Sidebar - Fixed on left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background glow effects for the Catchy theme */}
        {theme === 'catchy' && (
          <>
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
          </>
        )}
        
        {/* Topbar - Fixed on top of main area */}
        <Topbar />

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
