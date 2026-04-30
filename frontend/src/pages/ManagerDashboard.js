import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, Clock, LogOut, ClipboardList, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl p-5 flex items-center gap-4"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}
  >
    <div className="p-3 rounded-xl" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <p className="text-slate-400 text-xs font-medium">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
);

const ManagerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch { toast.error('Could not fetch tasks'); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending   = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen p-6" style={{ background: '#050508' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.08) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      <div className="fixed top-0 right-0 w-1/2 h-1/2 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.12) 0%, transparent 60%)',
      }} />

      <div className="relative max-w-5xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center gap-4 mb-8 p-6 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.2))',
              border: '1px solid rgba(16,185,129,0.3)',
            }}>
              <Briefcase size={22} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Manager View</p>
              <h1 className="text-xl font-bold text-white">Welcome, {user.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-emerald-300"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
              {user.role?.toUpperCase()}
            </span>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <LogOut size={15} /> Logout
            </motion.button>
          </div>
        </motion.header>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={ClipboardList} label="Team Tasks"     value={tasks.length} color="#818cf8" />
          <StatCard icon={CheckCircle2}  label="Completed"      value={completed}    color="#34d399" />
          <StatCard icon={Clock}         label="Pending"        value={pending}      color="#fbbf24" />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" /> Team Progress Overview
          </h2>
          {tasks.length === 0 ? (
            <p className="text-slate-500 text-sm">No tasks assigned to your team.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map(task => (
                <li key={task._id} className="flex justify-between items-center p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div>
                    <p className="text-white text-sm font-medium">{task.title}</p>
                    <p className="text-slate-500 text-xs">Assignee: {task.assignedTo?.name || 'Unassigned'}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    task.status === 'completed'
                      ? 'text-emerald-400 bg-emerald-400/10'
                      : 'text-amber-400 bg-amber-400/10'
                  }`}>
                    {task.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
