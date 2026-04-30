import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const NotAuthorized = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Redirect to the correct dashboard based on role
  const goToDashboard = () => {
    if (!user) return navigate('/login');
    const roleRoutes = { admin: '/admin-dashboard', manager: '/manager-dashboard', user: '/user-dashboard' };
    navigate(roleRoutes[user.role] || '/login');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative"
      style={{ background: '#050508' }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(239,68,68,0.12) 0%, transparent 65%)',
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(239,68,68,0.1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-md w-full text-center"
        style={{
          background: 'rgba(9,9,18,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: '24px',
          padding: '48px 40px',
          boxShadow: '0 0 0 1px rgba(239,68,68,0.05), 0 40px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <ShieldOff size={36} style={{ color: '#f87171' }} />
        </motion.div>

        {/* Error code */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: '#f87171' }}
        >
          403 — Access Forbidden
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-3xl font-bold text-white mb-3 tracking-tight"
        >
          Not Authorized
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 text-sm leading-relaxed mb-8"
        >
          {user
            ? `Your account has the "${user.role}" role, which doesn't have permission to view this page.`
            : 'You must be logged in to access this page.'}
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          {user && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={goToDashboard}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
              }}
            >
              <ArrowLeft size={16} />
              Go to My Dashboard
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="w-full py-3 rounded-xl text-sm font-medium text-slate-400 flex items-center justify-center gap-2 transition-colors hover:text-white"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <LogOut size={16} />
            Sign out
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotAuthorized;
