import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  Shield, 
  Trash2, 
  Plus,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Layout from '../components/Layout';

const Team = () => {
  const { t } = useTranslation();
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeam = async () => {
    try {
      const { data } = await API.get('/users');
      setTeam(data);
    } catch {
      toast.error(t('team.messages.loadFailed') || 'Could not load team members');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('team.messages.confirmDelete'))) return;
    try {
      await API.delete(`/users/${id}`);
      toast.success(t('team.messages.memberRemoved'));
      fetchTeam();
    } catch {
      toast.error(t('team.messages.removeFailed'));
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{t('team.header.title')}</h1>
          <p className="text-sm text-slate-400">{t('team.header.subtitle')}</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2">
          <Plus size={18} /> {t('team.header.invite')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/10 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">{t('team.table.member')}</th>
                  <th className="px-6 py-4 font-semibold">{t('team.table.role')}</th>
                  <th className="px-6 py-4 font-semibold">{t('team.table.taskStats')}</th>
                  <th className="px-6 py-4 font-semibold">{t('team.table.progress')}</th>
                  <th className="px-6 py-4 font-semibold text-right">{t('team.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {team.map((member, index) => (
                  <motion.tr 
                    key={member._id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/[0.01] transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{member.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <Mail size={12} /> {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {member.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock size={14} className="text-amber-500" />
                          <span className="text-white font-medium">{member.totalTasks}</span> {t('team.table.total')}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-white font-medium">{member.completedTasks}</span> {t('team.table.done')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="w-32">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{t('team.table.efficiency')}</span>
                          <span className="text-[10px] font-bold text-blue-400">
                            {member.totalTasks > 0 ? Math.round((member.completedTasks / member.totalTasks) * 100) : 0}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${member.totalTasks > 0 ? (member.completedTasks / member.totalTasks) * 100 : 0}%` }}
                            className="h-full bg-white rounded-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {member.role !== 'admin' && (
                        <button 
                          onClick={() => handleDelete(member._id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Team;
