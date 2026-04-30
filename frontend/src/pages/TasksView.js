import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Calendar,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  LayoutGrid,
  List
} from 'lucide-react';
import Layout from '../components/Layout';

const TasksView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch {
      toast.error('Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
      case 'in-progress': return 'text-indigo-400 border-indigo-400/20 bg-indigo-400/5';
      default: return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Task Workspace</h1>
          <p className="text-sm text-slate-400">Search, filter, and manage all projects in one place.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search tasks or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#09090b] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-all shadow-inner"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#09090b] border border-white/5 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500/50 cursor-pointer min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Tasks Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, index) => (
            <motion.div
              layout
              key={task._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#09090b] border border-white/5 rounded-2xl p-6 group hover:border-blue-500/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusStyle(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  {user.role === 'admin' && (
                    <span className="text-[10px] text-slate-500 font-medium">#{task._id.slice(-4)}</span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{task.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-3 mb-6 leading-relaxed">
                  {task.description || "No description provided for this task."}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={14} className="text-blue-500" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-white">
                      {task.assignedTo?.name?.charAt(0) || '?'}
                    </div>
                    <span className="max-w-[80px] truncate">{task.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTasks.length === 0 && !loading && (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-slate-600" size={32} />
          </div>
          <h3 className="text-white font-semibold">No tasks found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </Layout>
  );
};

export default TasksView;
