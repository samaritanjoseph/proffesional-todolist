import React, { useState } from 'react';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  ShieldCheck,
  Save,
  Check,
  Loader2
} from 'lucide-react';
import Layout from '../components/Layout';

const Settings = () => {
  const { t } = useTranslation();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'catchy');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: storedUser.name || '',
    email: storedUser.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('email', formData.email);

      const { data } = await API.patch('/users/profile', updateData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(t('settings.profile.success'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('settings.profile.failed'));
    } finally {
      setLoading(false);
    }
  };


  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error(t('settings.security.matchError'));
    }

    setLoading(true);
    try {
      await API.patch('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success(t('settings.security.success'));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || t('settings.security.failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('storage'));
    toast.success(t('settings.appearance.switched'));
  };

  const tabs = [
    { id: 'profile', name: t('settings.tabs.profile'), icon: User },
    { id: 'security', name: t('settings.tabs.security'), icon: Lock },
    { id: 'notifications', name: t('settings.tabs.notifications'), icon: Bell },
    { id: 'appearance', name: t('settings.tabs.appearance'), icon: Palette }
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{t('settings.header.title')}</h1>
        <p className="text-sm text-slate-400">{t('settings.header.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Navigation Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Main Settings Content */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-[var(--bg-card)] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          {loading && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={32} />
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-8">

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('settings.profile.fullName')}</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('settings.profile.email')}</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex justify-end">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                  <Save size={18} /> {t('settings.profile.save')}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">{t('settings.security.title')}</h3>
                <p className="text-sm text-slate-500">{t('settings.security.subtitle')}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('settings.security.currentPassword')}</label>
                  <input 
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('settings.security.newPassword')}</label>
                    <input 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('settings.security.confirmPassword')}</label>
                    <input 
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex justify-end">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                  <ShieldCheck size={18} /> {t('settings.security.update')}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{t('settings.appearance.title')}</h3>
                <p className="text-sm text-slate-500 mb-6">{t('settings.appearance.subtitle')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => handleThemeChange('catchy')}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      theme === 'catchy' ? 'border-indigo-600 bg-indigo-600/5' : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="h-24 rounded-xl bg-[#0f172a] mb-4 overflow-hidden relative border border-white/5">
                       <div className="absolute top-2 left-2 w-8 h-2 bg-indigo-600 rounded"></div>
                       <div className="absolute bottom-2 right-2 w-4 h-4 bg-indigo-500/20 blur-md rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{t('settings.appearance.catchy')}</span>
                      {theme === 'catchy' && <Check size={18} className="text-indigo-500" />}
                    </div>
                  </div>

                  <div 
                    onClick={() => handleThemeChange('bw')}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      theme === 'bw' ? 'border-white bg-white/5' : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="h-24 rounded-xl bg-black mb-4 overflow-hidden relative border border-white/10">
                       <div className="absolute top-2 left-2 w-8 h-2 bg-white rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{t('settings.appearance.bw')}</span>
                      {theme === 'bw' && <Check size={18} className="text-white" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-slate-500 italic text-sm">{t('settings.notifications.info')}</p>
            </div>
          )}
        </motion.div>

      </div>
    </Layout>
  );
};

export default Settings;
