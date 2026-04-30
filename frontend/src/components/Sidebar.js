import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  
  // Base navigation
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks-view' },
    { name: 'Calendar', icon: CalendarDays, path: '/calendar' },
    { name: 'Analytics', icon: BarChart3, path: '/admin-dashboard' },
    { name: 'Team', icon: Users, path: '/team' },
  ];

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
        <span className="font-bold text-xl text-white tracking-tight">Task Manager</span>
      </div>

      {/* Main Nav */}
      <div className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
           <NavItem key={item.name} item={item} />
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="pt-6 border-t border-white/10 flex flex-col gap-1">
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
          <span>Settings</span>
        </NavLink>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 mt-1 font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
