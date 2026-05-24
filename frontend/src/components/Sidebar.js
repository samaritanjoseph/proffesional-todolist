import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Base navigation
  const navItems = [
    { 
      name: t('sidebar.dashboard'), 
      rawName: 'Dashboard', 
      icon: LayoutDashboard, 
      path: user.role === 'admin' 
        ? '/admin-dashboard' 
        : user.role === 'manager' 
          ? '/manager-dashboard' 
          : '/user-dashboard' 
    },
    { name: t('sidebar.tasks'), rawName: 'Tasks', icon: CheckSquare, path: '/tasks-view' },
    { name: t('sidebar.calendar'), rawName: 'Calendar', icon: CalendarDays, path: '/calendar' },
    { name: t('sidebar.team'), rawName: 'Team', icon: Users, path: '/team' },
  ].filter(item => {
    if (item.rawName === 'Team') {
      return user.role === 'admin' || user.role === 'manager';
    }
    return true;
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const NavItem = ({ item }) => (
    <NavLink 
      to={item.path}
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30' 
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`
      }
    >
      <item.icon size={20} />
      <span>{item.name}</span>
    </NavLink>
  );

  return (
    <div className="w-64 h-screen border-r border-white/10 bg-[var(--bg-primary)] flex flex-col p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <LayoutDashboard size={20} />
        </div>
        <span className="font-bold text-xl text-white tracking-tight">Nexus</span>
      </div>

      {/* Main Nav */}
      <div className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
           <NavItem key={item.rawName} item={item} />
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="pt-6 border-t border-white/10 flex flex-col gap-1">
        <NavLink 
          to="/subscription"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`
          }
        >
          <CreditCard size={20} />
          <span>Subscription</span>
        </NavLink>
        
        <NavLink 
          to="/settings"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`
          }
        >
          <Settings size={20} />
          <span>{t('sidebar.settings')}</span>
        </NavLink>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 mt-1 font-medium"
        >
          <LogOut size={20} />
          <span>{t('sidebar.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
