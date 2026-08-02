import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, KeyRound, Save, Check, ShieldCheck, Mail, UserCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, refreshProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileErr('');

    if (!name.trim() || !email.trim()) {
      setProfileErr('Name and email are required.');
      return;
    }

    try {
      setUpdatingProfile(true);
      const res = await api.put('/auth/profile', { name: name.trim(), email: email.trim() });
      if (res.data.success) {
        updateUser({ name: res.data.user.name, email: res.data.user.email });
        setProfileMsg('Profile information updated successfully.');
        refreshProfile();
      }
    } catch (err: any) {
      setProfileErr(err.message || 'Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');

    if (!currentPassword || !newPassword) {
      setPasswordErr('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErr('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordErr('New password must be at least 6 characters.');
      return;
    }

    try {
      setUpdatingPassword(true);
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        setPasswordMsg('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setPasswordErr(err.message || 'Failed to change password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center space-x-2">
          <User className="w-6 h-6 text-pink-400" />
          <span>User Profile & Security Settings</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Manage your account credentials, email preferences, and security passwords.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4 text-slate-100">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
            <UserCheck className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm font-serif font-bold text-white">General Information</h3>
          </div>

          {profileMsg && (
            <div className="p-3 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded-xl backdrop-blur-md">
              {profileMsg}
            </div>
          )}

          {profileErr && (
            <div className="p-3 text-xs font-medium text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-xl backdrop-blur-md">
              {profileErr}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-full transition-all flex items-center justify-center space-x-2 shadow-lg shadow-pink-950/50 border border-pink-400/30 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{updatingProfile ? 'Saving...' : 'Update Account Info'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4 text-slate-100">
          <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
            <KeyRound className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm font-serif font-bold text-white">Change Password</h3>
          </div>

          {passwordMsg && (
            <div className="p-3 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded-xl backdrop-blur-md">
              {passwordMsg}
            </div>
          )}

          {passwordErr && (
            <div className="p-3 text-xs font-medium text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-xl backdrop-blur-md">
              {passwordErr}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                New Password (min 6 characters)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={updatingPassword}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-pink-400" />
              <span>{updatingPassword ? 'Updating Password...' : 'Change Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
