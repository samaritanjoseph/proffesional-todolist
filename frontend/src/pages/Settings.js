import React, { useState, useRef } from 'react';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Palette, 
  ShieldCheck,
  Save,
  Camera,
  Check,
  Loader2
} from 'lucide-react';
import Layout from '../components/Layout';

const Settings = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'catchy');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: storedUser.name || '',
    email: storedUser.email || '',
    avatar: storedUser.avatar || ''
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
      toast.success('Profile updated successfully!');
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('avatar', file);

    setLoading(true);
    try {
      const { data } = await API.patch('/users/profile', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, avatar: data.user.avatar });
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Avatar updated!');
      window.dispatchEvent(new Event('storage')); // Trigger Topbar/Sidebar update
    } catch (err) {
      console.error('Avatar Upload Error:', err);
      toast.error(err.response?.data?.message || 'Upload failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await API.patch('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('storage'));
    toast.success(`Theme switched!`);
  };

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: User },
    { id: 'security', name: 'Security & Password', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Account Settings</h1>
        <p className="text-sm text-slate-400">Manage your profile, notifications, and preferences.</p>
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
              {/* Avatar Section */}
              <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl overflow-hidden">
                    {formData.avatar ? (
                      <img src={`http://localhost:5000${formData.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      formData.name.charAt(0)
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Camera size={24} className="text-white" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Profile Photo</h3>
                  <p className="text-xs text-slate-500 mb-3">Upload a square image (JPG or PNG, max 2MB).</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => fileInputRef.current.click()} className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider">Change Avatar</button>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
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
                  <Save size={18} /> SAVE CHANGES
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Change Password</h3>
                <p className="text-sm text-slate-500">Ensure your account is using a long, random password to stay secure.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Password</label>
                  <input 
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Password</label>
                    <input 
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confirm Password</label>
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
                  <ShieldCheck size={18} /> UPDATE PASSWORD
                </button>
              </div>
            </form>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Theme Selection</h3>
                <p className="text-sm text-slate-500 mb-6">Choose the look and feel that suits your workflow.</p>
                
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
                      <span className="text-sm font-bold text-white">Catchy Vibrant</span>
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
                      <span className="text-sm font-bold text-white">Black & White</span>
                      {theme === 'bw' && <Check size={18} className="text-white" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-slate-500 italic text-sm">Notifications system is automated and always ON.</p>
            </div>
          )}
        </motion.div>

      </div>
    </Layout>
  );
};

export default Settings;
