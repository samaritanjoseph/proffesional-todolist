import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight, LayoutDashboard, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success("Account Created Successfully");
      
      const roleRoutes = { admin: '/admin-dashboard', manager: '/manager-dashboard', user: '/user-dashboard' };
      navigate(roleRoutes[data.user.role] || '/user-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    } finally {
      setIsLoading(false);
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
              Join the <br/>Network.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Create an account to experience the next generation of task management.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex gap-3 items-center text-sm text-slate-500 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.05] w-fit"
          >
            <ShieldCheck size={18} className="text-emerald-500/80" />
            <span>Military-Grade Encryption</span>
          </motion.div>
        </div>

        {/* Form Side */}
        <div className="p-8 lg:p-14 flex flex-col justify-center relative">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2, duration: 0.6 }}
             className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-sm text-slate-400">Sign up to get started.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-400 ml-1">Full Name</label>
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
              <label className="text-[13px] font-medium text-slate-400 ml-1">Email Address</label>
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
                <label className="text-[13px] font-medium text-slate-400 ml-1">Password</label>
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
                <label className="text-[13px] font-medium text-slate-400 ml-1">Confirm</label>
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
                  <>Create Workspace <ArrowRight size={16} /></>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-6 text-center text-slate-500 text-sm"
          >
            Already have an account? <Link to="/login" className="text-white hover:text-blue-400 transition-colors font-medium">Sign in</Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;