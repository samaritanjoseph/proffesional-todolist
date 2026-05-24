import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight, LayoutDashboard, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (isRegistered && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRegistered, resendTimer]);

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const { data } = await API.post('/auth/resend-otp', {
        email: formData.email
      });
      toast.success(data.message || 'New OTP sent to your email.');
      setResendTimer(30);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error(t('register.fillFields'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('register.passMismatch'));
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setIsRegistered(true);
      toast.success(data.message || t('register.otpSentSuccess'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('register.regFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error(t('register.otpLengthError'));
      return;
    }

    setIsVerifying(true);
    try {
      const { data } = await API.post('/auth/verify-otp', {
        email: formData.email,
        otp
      });
      toast.success(data.message || t('register.verified'));
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || t('register.invalidOtp'));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] p-4 font-sans text-slate-200 overflow-hidden relative">
      {/* Background Subtle Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[1000px] grid lg:grid-cols-2 bg-[#09090b]/80 backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden"
      >
        
        {/* Visual Side */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-white/[0.03] to-transparent border-r border-white/[0.05]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <LayoutDashboard size={24} className="text-blue-400" />
              </div>
              <span className="font-semibold text-xl tracking-tight text-white">Nexus</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight text-white mb-4">
              {t('register.title').split('.')[0]}<br/>
              {t('register.title').includes('.') ? '.' : ''}
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              {t('register.subtitle')}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex gap-3 items-center text-sm text-slate-500 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.05] w-fit"
          >
            <ShieldCheck size={18} className="text-emerald-500/80" />
            <span>Secure OTP Verification</span>
          </motion.div>
        </div>

        {/* Form Side */}
        <div className="p-8 lg:p-14 flex flex-col justify-center relative">
          {isRegistered ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                <ShieldCheck className="text-blue-400" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight mb-1">{t('register.enterOtp')}</h2>
                <p className="text-sm text-slate-400">
                  {t('register.otpSent')} <span className="text-white font-medium">{formData.email}</span>.
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t('register.otpCode')}</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className="w-full text-center text-2xl tracking-[0.5em] font-bold py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:border-blue-500/50 outline-none text-white placeholder:text-slate-700"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                >
                  {isVerifying ? <Loader2 size={20} className="animate-spin" /> : <>{t('register.complete')} <ArrowRight size={18} /></>}
                </motion.button>
              </form>

              <div className="pt-2">
                {resendTimer > 0 ? (
                  <p className="text-xs text-slate-500 text-center font-medium">
                    Resend code in <span className="text-blue-400 font-bold">{resendTimer}s</span>
                  </p>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="w-full py-2.5 text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2 font-bold uppercase tracking-wider bg-blue-500/5 rounded-lg border border-blue-500/10"
                  >
                    {isResending ? <Loader2 size={14} className="animate-spin" /> : 'Resend Verification Code'}
                  </motion.button>
                )}
              </div>

              <button 
                onClick={() => {
                  setIsRegistered(false);
                  setResendTimer(30);
                }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors w-full text-center"
              >
                {t('register.wrongEmail')}
              </button>
            </motion.div>
          ) : (

            <>
              <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2, duration: 0.6 }}
                 className="mb-8"
              >
                <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">{t('register.createAccount')}</h2>
                <p className="text-sm text-slate-400">{t('register.signUpText')}</p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-400 ml-1">{t('register.fullName')}</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                      type="text"
                      className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-600 text-sm"
                      placeholder="John Doe"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-400 ml-1">{t('register.email')}</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-600 text-sm"
                      placeholder="name@company.com"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-400 ml-1">{t('register.password')}</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                      <input
                        type="password"
                        className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-600 text-sm"
                        placeholder="••••••••"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-400 ml-1">{t('register.confirm')}</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                      <input
                        type="password"
                        className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-600 text-sm"
                        placeholder="••••••••"
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-white text-black hover:bg-slate-200 font-medium rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin text-black" />
                    ) : (
                      <>{t('register.createWorkspace')} <ArrowRight size={16} /></>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="mt-6 text-center text-slate-500 text-sm"
              >
                {t('register.alreadyHave')} <Link to="/login" className="text-white hover:text-blue-400 transition-colors font-medium">{t('register.signIn')}</Link>
              </motion.p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;