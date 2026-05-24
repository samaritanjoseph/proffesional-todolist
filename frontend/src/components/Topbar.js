import React from 'react';
import { Search, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Topbar = () => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const backendUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="h-20 px-8 border-b border-white/10 bg-[var(--bg-card)]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-50">
      
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder={t('topbar.search')}
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <LanguageSelector />
        
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-[var(--bg-primary)]"></span>
        </button>

        <div className="w-px h-6 bg-white/10"></div>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30 overflow-hidden border border-white/10">
            {user.avatar ? (
              <img src={`${backendUrl}${user.avatar}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user.name ? user.name.charAt(0).toUpperCase() : 'U'
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{user.name}</span>
            <span className="text-xs text-slate-500 capitalize">{user.role}</span>
          </div>
          <ChevronDown size={16} className="text-slate-500 ml-1 group-hover:text-slate-300" />
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-500 hover:text-red-400 transition-colors ml-2"
          title={t('topbar.logout')}
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
