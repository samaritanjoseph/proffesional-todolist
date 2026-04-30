import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  CheckSquare, 
  Play, 
  Clock, 
  MoreVertical, 
  Bell, 
  Trash2,
  PauseCircle,
  Square,
  X
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Layout from '../components/Layout';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-[#09090b] border border-white/5 rounded-2xl p-5 flex flex-col justify-between"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={20} />
      </div>
      <button className="text-slate-500 hover:text-slate-300"><MoreVertical size={18}/></button>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch { toast.error('Could not fetch tasks'); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch { /* Fail silently if users route unavailable */ }
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/tasks/analytics');
      setAnalyticsData(data);
    } catch { /* Default to empty array if fail */ }
  };

  const handleDeleteUser = async (userId) => {
    if(!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${userId}`);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch { toast.error("Could not delete user"); }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    // Validate Year Length (Must be 4 digits)
    const year = newTask.dueDate.split('-')[0];
    if (year.length > 4) {
      return toast.error("Year must be exactly 4 digits");
    }

    try {
      await API.post('/tasks', newTask);
      toast.success("Task created successfully!");
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchTasks();
      fetchAnalytics();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  }

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Dashboard</h1>
          <p className="text-sm text-slate-400">Welcome back! Here's an overview of your projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          + NEW TASK
        </button>
      </div>

      {/* ── Top Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Folder} label="Total Projects" value={tasks.length} color="#3b82f6" delay={0.1} />
        <StatCard icon={CheckSquare} label="Ended Projects" value={completed} color="#10b981" delay={0.2} />
        <StatCard icon={Play} label="Running Projects" value={inProgress} color="#8b5cf6" delay={0.3} />
        <StatCard icon={Clock} label="Pending Projects" value={pending} color="#f59e0b" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* ── Analytics Chart ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-[#09090b] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Project Analytics</h2>
            <select className="bg-white/5 border border-white/10 text-slate-300 text-xs px-3 py-1.5 rounded-lg outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
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
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '13px' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="pending" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPending)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ── Reminders & Time Tracker ── */}
        <div className="flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-[#09090b] border border-white/5 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-2xl rounded-full pointer-events-none"></div>
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Current Session</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-white font-mono tracking-tighter">02:45:12</p>
                <p className="text-xs text-white/50 mt-1 uppercase font-bold tracking-wider">UI REDESIGN</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"><PauseCircle size={20}/></button>
                <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"><Square size={20}/></button>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="flex-1 bg-[#09090b] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-white">Reminders</h2>
              <button className="text-blue-400 text-xs font-medium hover:underline">View All</button>
            </div>
            <ul className="space-y-4">
              {[
                { time: '10:00 AM', title: 'Team Standup', color: 'bg-white' },
                { time: '02:00 PM', title: 'Client Review', color: 'bg-zinc-500' },
                { time: '04:30 PM', title: 'Deploy to Staging', color: 'bg-zinc-700' }
              ].map((r, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${r.color} mt-1.5`}></div>
                    {i !== 2 && <div className="w-px h-full bg-white/10 mt-1"></div>}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-slate-200">{r.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Project List (Tasks) ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="lg:col-span-2 bg-[#09090b] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">All Projects</h2>
            <button className="text-slate-500 hover:text-white"><MoreVertical size={18}/></button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs text-slate-500">
                  <th className="pb-3 font-medium">PROJECT NAME</th>
                  <th className="pb-3 font-medium">ASSIGNEE</th>
                  <th className="pb-3 font-medium">DUE DATE</th>
                  <th className="pb-3 font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 && (
                  <tr><td colSpan="4" className="py-4 text-center text-sm text-slate-500">No projects found.</td></tr>
                )}
                {tasks.map(task => (
                  <tr key={task._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 text-sm font-medium text-white">{task.title}</td>
                    <td className="py-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
                          {task.assignedTo?.name ? task.assignedTo.name.charAt(0) : '?'}
                        </div>
                        {task.assignedTo?.name || 'Unassigned'}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-slate-400">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border ${
                        task.status === 'completed' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 
                        task.status === 'in-progress' ? 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5' : 
                        'text-amber-400 border-amber-400/20 bg-amber-400/5'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Team Collaboration ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="bg-[#09090b] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Team Members</h2>
            <button className="text-slate-500 hover:text-white"><MoreVertical size={18}/></button>
          </div>
          <ul className="space-y-4">
            {users.length === 0 && <p className="text-sm text-slate-500">No team members.</p>}
            {users.map(u => (
              <li key={u._id} className="flex justify-between items-center group p-2 hover:bg-white/5 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{u.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{u.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-slate-300 transition-colors"><Bell size={14}/></button>
                   {/* Delete button always visible now, using Trash2 */}
                   {u.role !== 'admin' && (
                     <button 
                       onClick={() => handleDeleteUser(u._id)} 
                       className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-md text-red-400 transition-colors"
                       title="Delete User"
                     >
                       <Trash2 size={14}/>
                     </button>
                   )}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ── Create Task Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#09090b] border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Create New Task</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Task Title</label>
                  <input 
                    type="text" required
                    value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Description (Optional)</label>
                  <textarea 
                    value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Assign To</label>
                    <select 
                      required
                      value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                      className="w-full bg-[#050508] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                    >
                      <option value="" disabled>Select User</option>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Due Date</label>
                    <input 
                      type="date" required
                      max="9999-12-31"
                      value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                      className="w-full bg-[#050508] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500 style-date"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                    CREATE TASK
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

export default AdminDashboard;
