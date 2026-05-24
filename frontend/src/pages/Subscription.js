import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Check, X, Zap, Sparkles, ShieldCheck, Star } from 'lucide-react';
import API from '../api/axiosInstance';
import Layout from '../components/Layout';

function Subscription() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isPremium = user.isPremium || false;

  useEffect(() => {
    const verified = searchParams.get('verified');
    const reference = searchParams.get('reference');

    if (verified === 'true' && reference) {
      verifyTransaction(reference);
    }
  }, [searchParams]);

  const verifyTransaction = async (reference) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/subscriptions/verify/${reference}`);
      toast.success(data.message || 'Subscription activated successfully!');
      
      // Update user in local storage
      const updatedUser = { 
        ...user, 
        isPremium: true, 
        subscriptionStatus: 'active', 
        subscriptionPlan: 'premium' 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Redirect to user dashboard to start creating tasks
      setTimeout(() => window.location.href = '/user-dashboard', 1500);
    } catch (error) {
      console.error('Verification error:', error);
      const errorMsg = error.response?.data?.message || 'An error occurred during verification.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/subscriptions/initialize');

      if (data.authorization_url) {
        // Redirect to Paystack checkout
        window.location.href = data.authorization_url;
      } else {
        toast.error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Initialization error:', error);
      const errorMsg = error.response?.data?.message || 'An error occurred while initializing payment.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center py-6 px-4">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-4xl w-full space-y-12 relative z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-indigo-500/20">
              <Sparkles size={14} className="animate-pulse" /> Nexus Premium
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Elevate Your Productivity
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
              Get complete control over your tasks, unlock advanced scheduling, and supercharge your daily workflow with Nexus Premium.
            </p>
          </motion.div>

          {/* Plan Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch pt-4">
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#09090b]/80 border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 transition-all duration-300 relative overflow-hidden backdrop-blur-xl"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Free Plan</h3>
                    <p className="text-sm text-slate-500 mt-1">For basic tracking and view</p>
                  </div>
                </div>

                <div className="flex items-baseline text-white mb-8">
                  <span className="text-5xl font-extrabold tracking-tight">₦0</span>
                  <span className="ml-1 text-lg font-medium text-slate-500">/forever</span>
                </div>

                <div className="border-t border-white/5 my-6"></div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-slate-300">
                    <div className="bg-emerald-500/10 text-emerald-400 p-0.5 rounded-full mt-0.5">
                      <Check size={14} />
                    </div>
                    <span className="text-sm">View assigned tasks</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <div className="bg-emerald-500/10 text-emerald-400 p-0.5 rounded-full mt-0.5">
                      <Check size={14} />
                    </div>
                    <span className="text-sm">Update assigned task status</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <div className="bg-red-500/10 text-red-400/50 p-0.5 rounded-full mt-0.5">
                      <X size={14} />
                    </div>
                    <span className="text-sm line-through">Create and manage your own tasks</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <div className="bg-red-500/10 text-red-400/50 p-0.5 rounded-full mt-0.5">
                      <X size={14} />
                    </div>
                    <span className="text-sm line-through">Premium support channels</span>
                  </li>
                </ul>
              </div>

              <div>
                <button 
                  disabled 
                  className="w-full py-3.5 px-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-bold text-sm cursor-not-allowed transition-all"
                >
                  {isPremium ? 'Free Tier' : 'Current Plan'}
                </button>
              </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div 
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative bg-gradient-to-b from-indigo-950/40 to-slate-950/90 border border-indigo-500/30 rounded-3xl p-8 flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-300 overflow-hidden shadow-2xl shadow-indigo-500/10 backdrop-blur-xl"
            >
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl flex items-center gap-1 shadow-lg">
                <Star size={10} fill="white" /> Popular
              </div>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      Premium Plan <Zap size={16} className="text-indigo-400 fill-indigo-400" />
                    </h3>
                    <p className="text-sm text-indigo-300/70 mt-1">Unlock ultimate capability</p>
                  </div>
                </div>

                <div className="flex items-baseline text-white mb-8">
                  <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">₦5,000</span>
                  <span className="ml-1 text-lg font-medium text-indigo-300/50">/month</span>
                </div>

                <div className="border-t border-indigo-500/20 my-6"></div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-slate-200">
                    <div className="bg-indigo-500/20 text-indigo-300 p-0.5 rounded-full mt-0.5">
                      <Check size={14} />
                    </div>
                    <span className="text-sm">Everything in Free Plan</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-200">
                    <div className="bg-indigo-500/20 text-indigo-300 p-0.5 rounded-full mt-0.5">
                      <Check size={14} />
                    </div>
                    <span className="text-sm font-semibold text-white">Create and manage your own tasks</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-200">
                    <div className="bg-indigo-500/20 text-indigo-300 p-0.5 rounded-full mt-0.5">
                      <Check size={14} />
                    </div>
                    <span className="text-sm">Priority dashboard access</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-200">
                    <div className="bg-indigo-500/20 text-indigo-300 p-0.5 rounded-full mt-0.5">
                      <Check size={14} />
                    </div>
                    <span className="text-sm">Dedicated support and instant assistance</span>
                  </li>
                </ul>
              </div>

              <div>
                {isPremium ? (
                  <div className="flex flex-col gap-2">
                    <button 
                      disabled 
                      className="w-full py-3.5 px-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShieldCheck size={16} /> Premium Active
                    </button>
                    <p className="text-[10px] text-center text-slate-500">Your subscription is active and managed via Paystack</p>
                  </div>
                ) : (
                  <button 
                    onClick={handleSubscribe} 
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    ) : (
                      <>Upgrade Now</>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Subscription;
