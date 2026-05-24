import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay }}
    className="bg-[#09090b] border border-white/5 rounded-2xl p-5 flex flex-col justify-between"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={20} />
      </div>
      <button className="text-slate-500 hover:text-slate-300">
        <MoreVertical size={18}/>
      </button>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  </motion.div>
);

export default StatCard;
