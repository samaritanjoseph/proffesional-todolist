import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  Folder, 
  CheckSquare, 
  Play, 
  Clock, 
  MoreVertical,
  PlayCircle,
  PauseCircle,
  Square
} from 'lucide-react';
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

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch { toast.error('Could not fetch tasks'); }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}`, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
      fetchTasks();
    } catch { toast.error('Failed to update task'); }
  }

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">My Dashboard</h1>
          <p className="text-sm text-slate-400">Track your assigned projects and time.</p>
        </div>
      </div>

      {/* ── Top Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Folder} label="My Projects" value={tasks.length} color="#3b82f6" delay={0.1} />
        <StatCard icon={CheckSquare} label="Ended Projects" value={completed} color="#10b981" delay={0.2} />
        <StatCard icon={Play} label="Running Projects" value={inProgress} color="#8b5cf6" delay={0.3} />
        <StatCard icon={Clock} label="Pending Projects" value={pending} color="#f59e0b" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ── Assigned Project List (Left, spans 2 cols) ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-[#09090b] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Assigned to Me</h2>
            <button className="text-slate-500 hover:text-white"><MoreVertical size={18}/></button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs text-slate-500">
                  <th className="pb-3 font-medium">PROJECT NAME</th>
                  <th className="pb-3 font-medium">DUE DATE</th>
                  <th className="pb-3 font-medium">CURRENT STATUS</th>
                  <th className="pb-3 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 && (
                  <tr><td colSpan="4" className="py-4 text-center text-sm text-slate-500">No projects assigned yet.</td></tr>
                )}
                {tasks.map(task => (
                  <tr key={task._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 text-sm font-medium text-white">
                      {task.title}
                      {task.description && <p className="text-xs text-slate-500 font-normal mt-1">{task.description}</p>}
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
                    <td className="py-4 text-right">
                       <select 
                         value={task.status}
                         onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                         className="bg-white/5 border border-white/10 text-slate-300 text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer hover:bg-white/10 transition-colors"
                       >
                         <option value="pending" className="bg-[#09090b]">Pending</option>
                         <option value="in-progress" className="bg-[#09090b]">In Progress</option>
                         <option value="completed" className="bg-[#09090b]">Completed</option>
                       </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Right Column (Time Tracker + Reminders) ── */}
        <div className="flex flex-col gap-6">
          {/* Time Tracker Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-[#09090b] border border-white/5 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-2xl rounded-full pointer-events-none"></div>
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Current Session</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-white font-mono">00:00:00</p>
                <p className="text-xs text-purple-400 mt-1">Ready to start?</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors"><PlayCircle size={20}/></button>
              </div>
            </div>
          </motion.div>

          {/* Activity Feed / Reminders */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="flex-1 bg-[#09090b] border border-white/5 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-white">Upcoming Deadlines</h2>
            </div>
            <ul className="space-y-4">
               {tasks.filter(t => t.status !== 'completed').slice(0, 4).map((task, i) => (
                 <li key={i} className="flex gap-4 items-start">
                   <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                   <div>
                     <p className="text-sm font-medium text-slate-200 line-clamp-1">{task.title}</p>
                     <p className="text-xs text-slate-500 mt-0.5">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                   </div>
                 </li>
               ))}
               {tasks.filter(t => t.status !== 'completed').length === 0 && (
                 <p className="text-xs text-slate-500">You're all caught up!</p>
               )}
            </ul>
          </motion.div>
        </div>

      </div>
    </Layout>
  );
};

export default UserDashboard;
