import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import Layout from '../components/Layout';

const Calendar = () => {
  const { t, i18n } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch {
      toast.error('Could not load tasks for calendar');
    }
  };

  // Calendar logic
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const monthNames = t('calendar.months', { returnObjects: true });
  const dayLabels = t('calendar.days', { returnObjects: true });

  const getTasksForDate = (day) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === day && 
             taskDate.getMonth() === month && 
             taskDate.getFullYear() === year;
    });
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (day) => {
    return day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };

  const calendarDays = [];
  // Fill empty slots for previous month days
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-24 md:h-32 border border-white/5 bg-white/[0.01]"></div>);
  }

  // Fill current month days
  for (let day = 1; day <= totalDays; day++) {
    const dayTasks = getTasksForDate(day);
    calendarDays.push(
      <div 
        key={day} 
        onClick={() => setSelectedDate(new Date(year, month, day))}
        className={`h-24 md:h-32 border border-white/5 p-2 transition-all cursor-pointer relative group ${
          isSelected(day) ? 'bg-blue-600/10' : 'hover:bg-white/[0.03]'
        }`}
      >
        <div className="flex justify-between items-start">
          <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
            isToday(day) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : isSelected(day) ? 'text-indigo-400' : 'text-slate-500'
          }`}>
            {day}
          </span>
          {dayTasks.length > 0 && (
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              {dayTasks.length > 1 && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>}
            </div>
          )}
        </div>
        
        <div className="mt-2 space-y-1 overflow-hidden">
          {dayTasks.slice(0, 2).map(task => (
            <div key={task._id} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 truncate border border-white/5">
              {task.title}
            </div>
          ))}
          {dayTasks.length > 2 && (
            <div className="text-[9px] text-slate-500 font-medium pl-1">
              {t('calendar.details.more', { count: dayTasks.length - 2 })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{t('calendar.header.title')}</h1>
          <p className="text-sm text-slate-400">{t('calendar.header.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-4 bg-[#09090b] border border-white/5 p-1.5 rounded-xl">
          <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"><ChevronLeft size={20} /></button>
          <span className="text-sm font-bold text-white min-w-[140px] text-center">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Calendar Grid */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-7 bg-white/[0.02] border-b border-white/10">
            {dayLabels.map(day => (
              <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays}
          </div>
        </motion.div>

        {/* Selected Day Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-[#09090b] border border-white/5 rounded-2xl p-6 h-fit"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-600/10 rounded-xl text-blue-500">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {selectedDate.toLocaleDateString(i18n.language, { day: 'numeric', month: 'long' })}
              </h2>
              <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">{t('calendar.details.schedule')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {getTasksForDate(selectedDate.getDate()).length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-xs text-slate-600 font-medium italic">{t('calendar.details.noTasks')}</p>
              </div>
            ) : (
              getTasksForDate(selectedDate.getDate()).map(task => (
                <div key={task._id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all group">
                  <h3 className="text-sm font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{task.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded border capitalize font-bold ${
                      task.status === 'completed' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 
                      'text-amber-400 border-amber-400/20 bg-amber-400/5'
                    }`}>
                      {task.status}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock size={12} />
                      <span className="text-[10px] font-medium">{t('calendar.details.overdue')}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </Layout>
  );
};

export default Calendar;
