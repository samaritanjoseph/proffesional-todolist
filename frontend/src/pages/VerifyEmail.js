import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await API.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900/50 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl"
      >
        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Verifying your email...</h2>
            <p className="text-slate-400">Please wait while we confirm your account setup.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <CheckCircle className="text-emerald-500" size={40} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Verification Successful!</h2>
            <p className="text-slate-400">{message}</p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              LOG IN NOW <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center">
                <XCircle className="text-red-500" size={40} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
            <p className="text-slate-400">{message}</p>
            <div className="flex flex-col gap-3">
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium text-sm">Try Registering Again</Link>
              <Link to="/login" className="text-slate-500 hover:text-slate-400 font-medium text-sm">Back to Login</Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
