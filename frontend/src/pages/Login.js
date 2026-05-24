import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, LayoutDashboard, ShieldCheck, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Animated dot grid background ────────────────────────────────────────────
const DotGrid = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage:
        'radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}
  />
);

// ─── Floating glow orbs ───────────────────────────────────────────────────────
const GlowOrbs = () => (
  <>
    <motion.div
      animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }}
    />
    <motion.div
      animate={{ x: [0, -25, 15, 0], y: [0, 30, -15, 0], scale: [1, 0.9, 1.05, 1] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }}
    />
    <motion.div
      animate={{ x: [0, 20, -10, 0], y: [0, -20, 30, 0] }}
      transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        filter: 'blur(80px)',
      }}
    />
  </>
);

// ─── Feature pills on the left panel ─────────────────────────────────────────
const features = [
  { icon: '⚡', label: 'Real-time sync across devices' },
  { icon: '🔐', label: 'End-to-end encrypted storage' },
  { icon: '📊', label: 'Smart priority & analytics' },
];

const shakeVariants = {
  idle: { x: 0 },
  shake: {
    x: [-8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.5 },
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  // Pre-fill if remembered
  useEffect(() => {
    const saved = localStorage.getItem('remembered_email');
    if (saved) {
      setFormData(prev => ({ ...prev, email: saved }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 600);
      toast.error(t('login.fillFields'));
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await API.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (rememberMe) {
        localStorage.setItem('remembered_email', formData.email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      toast.success(t('login.welcomeBack'));
      
      const roleRoutes = { admin: '/admin-dashboard', manager: '/manager-dashboard', user: '/user-dashboard' };
      navigate(roleRoutes[data.user.role] || '/user-dashboard');
    } catch (err) {
      setShakeForm(true);
      setTimeout(() => setShakeForm(false), 600);
      toast.error(err.response?.data?.message || t('login.authFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] p-4 overflow-hidden relative">
      {/* Backgrounds */}
      <DotGrid />
      <GlowOrbs />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[980px] grid lg:grid-cols-2 rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(9,9,18,0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 40px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* ── Left Visual Panel ── */}
        <div
          className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(59,130,246,0.04) 100%)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Subtle inner glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 60%)',
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-10">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.2))',
                  border: '1px solid rgba(99,102,241,0.3)',
                }}
              >
                <LayoutDashboard size={22} className="text-indigo-400" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Nexus</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight leading-[1.15] text-white mb-4">
              Enter your<br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #818cf8, #60a5fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Workspace.
              </span>
            </h1>
            <p className="text-slate-400 text-[15px] leading-relaxed max-w-xs">
              Secure, high-performance task management designed for elite teams who move fast.
            </p>
          </motion.div>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="relative z-10 space-y-3"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 text-sm text-slate-400"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                }}
              >
                <span className="text-base">{f.icon}</span>
                {f.label}
              </motion.div>
            ))}

            <div
              className="flex gap-2.5 items-center text-xs text-slate-500 mt-2 pt-1"
              style={{ paddingLeft: '4px' }}
            >
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>SOC 2 compliant · TLS 1.3 encrypted</span>
            </div>
          </motion.div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="p-2 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.2))',
                border: '1px solid rgba(99,102,241,0.3)',
              }}
            >
              <LayoutDashboard size={18} className="text-indigo-400" />
            </div>
            <span className="font-bold text-lg text-white">Nexus</span>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-indigo-400" />
              <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">
                Secure Login
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1.5">
              {t('login.title')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('login.subtitle')}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            animate={shakeForm ? 'shake' : 'idle'}
            variants={shakeVariants}
            className="space-y-4"
          >
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-1.5"
            >
              <label className="text-[13px] font-medium text-slate-400 ml-0.5">
                {t('login.email')}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: focusedField === 'email' ? '#818cf8' : '#475569' }}
                />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 rounded-xl outline-none transition-all duration-200"
                  style={{
                    background: focusedField === 'email' ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.03)',
                    border: focusedField === 'email'
                      ? '1px solid rgba(99,102,241,0.5)'
                      : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
                  }}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-1.5"
            >
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-medium text-slate-400 ml-0.5">
                  {t('login.password')}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[12px] text-slate-500 hover:text-indigo-400 transition-colors duration-200"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: focusedField === 'password' ? '#818cf8' : '#475569' }}
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 text-sm text-white placeholder:text-slate-600 rounded-xl outline-none transition-all duration-200"
                  style={{
                    background: focusedField === 'password' ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.03)',
                    border: focusedField === 'password'
                      ? '1px solid rgba(99,102,241,0.5)'
                      : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
                  tabIndex={-1}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={showPassword ? 'eye-off' : 'eye'}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.15 }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>

            {/* Remember Me */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex items-center gap-2.5"
            >
              <button
                type="button"
                id="remember-me"
                onClick={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200 flex-shrink-0"
                style={{
                  background: rememberMe
                    ? 'linear-gradient(135deg, #6366f1, #3b82f6)'
                    : 'rgba(255,255,255,0.04)',
                  border: rememberMe ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <AnimatePresence>
                  {rememberMe && (
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      width="9" height="9" viewBox="0 0 9 9" fill="none"
                    >
                      <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </button>
              <label
                htmlFor="remember-me"
                onClick={() => setRememberMe(!rememberMe)}
                className="text-[13px] text-slate-400 cursor-pointer select-none"
              >
                Remember me for 30 days
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.015, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                id="login-submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                  boxShadow: '0 4px 24px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut' }}
                />
                <AnimatePresence mode="wait" initial={false}>
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 size={18} className="animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      {t('login.signIn')} <ArrowRight size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Footer link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-7 text-center text-[13px] text-slate-500"
          >
            {t('login.noAccount')}{' '}
            <Link
              to="/register"
              className="font-medium transition-colors duration-200"
              style={{ color: '#818cf8' }}
              onMouseEnter={e => (e.target.style.color = '#a5b4fc')}
              onMouseLeave={e => (e.target.style.color = '#818cf8')}
            >
              {t('login.createAccount')} →
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;