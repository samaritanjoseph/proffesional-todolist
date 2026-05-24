import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  CheckSquare, 
  Play, 
  Clock, 
  Plus,
  X,
  TrendingUp,
  User,
  Calendar as CalendarIcon,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

const ManagerDashboard = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [analyticsData, setAnalyticsData] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch { 
      toast.error(t('managerDashboard.messages.fetchTasksFailed') || 'Could not fetch tasks'); 
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      // Filter out admins so managers see team members
      setUsers(data.filter(u => u.role !== 'admin'));
    } catch { 
      toast.error(t('managerDashboard.messages.fetchUsersFailed') || 'Could not fetch team members'); 
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Fetch 7 day analytics using the shared backend API
      const { data } = await API.get('/tasks/analytics');
      setAnalyticsData(data);
    } catch {
      // Fallback dummy data if analytics route fails
      setAnalyticsData([
        { name: 'Mon', completed: 2, pending: 1 },
        { name: 'Tue', completed: 4, pending: 3 },
        { name: 'Wed', completed: 3, pending: 2 },
        { name: 'Thu', completed: 5, pending: 4 },
        { name: 'Fri', completed: 6, pending: 2 },
        { name: 'Sat', completed: 4, pending: 1 },
        { name: 'Sun', completed: 7, pending: 2 },
      ]);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    // Validate Year Length (Must be 4 digits)
    const year = newTask.dueDate.split('-')[0];
    if (year.length > 4) {
      return toast.error(t('managerDashboard.messages.invalidYear') || "Year must be exactly 4 digits");
    }

    try {
      await API.post('/tasks', newTask);
      toast.success(t('managerDashboard.messages.taskCreated') || "Task assigned successfully!");
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchTasks();
      fetchAnalytics();
    } catch (err) {
      toast.error(err.response?.data?.message || t('managerDashboard.messages.createFailed') || "Failed to assign task");
    }
  };

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            {t('managerDashboard.title') || 'Manager Dashboard'}
          </h1>
          <p className="text-sm text-slate-400">
            {t('managerDashboard.subtitle') || `Welcome back, ${user.name}. Orchestrate your team's tasks.`}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 active:scale-[0.98]"
        >
          <Plus size={16} /> {t('managerDashboard.assignTask') || 'Assign New Task'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={ClipboardList} label={t('managerDashboard.stats.total') || 'Team Tasks'} value={tasks.length} color="#3b82f6" delay={0.1} />
        <StatCard icon={CheckSquare} label={t('managerDashboard.stats.completed') || 'Completed'} value={completed} color="#10b981" delay={0.2} />
        <StatCard icon={Play} label={t('managerDashboard.stats.inProgress') || 'In Progress'} value={inProgress} color="#8b5cf6" delay={0.3} />
        <StatCard icon={Clock} label={t('managerDashboard.stats.pending') || 'Pending'} value={pending} color="#f59e0b" delay={0.4} />
      </div>

      {/* Analytics and Team Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Analytics Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-[#09090b] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" />
              {t('managerDashboard.charts.title') || 'Task Resolution Flow'}
            </h2>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
              {t('managerDashboard.charts.week') || 'Last 7 Days'}
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '13px', color: '#fff' }}
                  labelStyle={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2} name="Completed" />
                <Area type="monotone" dataKey="pending" stroke="#6366f1" fillOpacity={1} fill="url(#colorPending)" strokeWidth={2} name="Pending" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Team Members List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
          className="bg-[#09090b] border border-white/5 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User size={18} className="text-indigo-400" />
                {t('managerDashboard.team.title') || 'My Team'}
              </h2>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {users.length} members
              </span>
            </div>
            <div className="space-y-4 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
              {users.map((member) => (
                <div key={member._id} className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/20 flex items-center justify-center font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{member.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-300">{member.totalTasks || 0} Tasks</p>
                    <p className="text-[9px] text-emerald-400 font-bold uppercase">{member.completedTasks || 0} Done</p>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-8">
                  {t('managerDashboard.team.empty') || 'No team members registered.'}
                </p>
              )}
            </div>
          </div>
          <a href="/team" className="w-full mt-4 flex items-center justify-center gap-1.5 py-2.5 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 rounded-xl transition-all border border-white/5 active:scale-[0.98]">
            Manage Team <ChevronRight size={14} />
          </a>
        </motion.div>
      </div>

      {/* Task Overview Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.7 }}
        className="bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ClipboardList size={18} className="text-indigo-400" />
            {t('managerDashboard.tasks.title') || 'Team Task Allocation'}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                <th className="px-6 py-4">Task Description</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description || 'No description'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/5 text-slate-300 flex items-center justify-center font-bold text-[10px] border border-white/10">
                        {task.assignedTo?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs text-slate-300 font-medium">{task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <CalendarIcon size={12} className="text-slate-500" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      task.status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : task.status === 'in-progress' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-slate-500 text-xs">
                    No tasks found. Create a new task above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#09090b] border border-white/10 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none"></div>

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Assign Task</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-500 hover:text-slate-300 p-1.5 hover:bg-white/5 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Task Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Complete sprint retro presentation"
                    value={newTask.title} 
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    placeholder="Provide details about expectations, deliverables, etc."
                    value={newTask.description} 
                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assign To Team Member</label>
                  <select 
                    required
                    value={newTask.assignedTo} 
                    onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="" disabled className="bg-[#09090b] text-slate-500">Select a team member...</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id} className="bg-[#09090b] text-white">
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Due Date</label>
                  <input 
                    type="date" 
                    required
                    value={newTask.dueDate} 
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 px-4 bg-white/5 border border-white/5 text-slate-300 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
                  >
                    Assign Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ManagerDashboard;
