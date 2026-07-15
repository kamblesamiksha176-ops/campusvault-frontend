import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  Coins, 
  TrendingUp, 
  Trash2, 
  UserPlus, 
  Check, 
  X, 
  Sliders, 
  Activity, 
  Upload, 
  LogOut, 
  Settings, 
  BarChart3, 
  Unlock, 
  Lock,
  Plus,
  Compass,
  FileText
} from 'lucide-react';
import { UserProfile, ResourceItem, ResourceType } from '../types';
import { GlassCard, GradientButton, PremiumBadge, SectionTitle } from './UIElements';

interface AdminDashboardProps {
  user: UserProfile;
  resources: ResourceItem[];
  usersList: UserProfile[];
  onLogout: () => void;
  onUpdateUsersList: (updated: UserProfile[]) => void;
  onUpdateResources: (updated: ResourceItem[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  resources,
  usersList,
  onLogout,
  onUpdateUsersList,
  onUpdateResources
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'resources' | 'ai-settings'>('analytics');
  
  // Custom states for admin material uploading
  const [adminUploadType, setAdminUploadType] = useState<ResourceType>('PDF');
  const [adminTitle, setAdminTitle] = useState('');
  const [adminSubject, setAdminSubject] = useState('');
  const [adminSemester, setAdminSemester] = useState('3rd Semester');
  const [adminBranch, setAdminBranch] = useState('Computer Engineering');
  const [adminFileName, setAdminFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // User management helper states
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // AI config states
  const [aiTemp, setAiTemp] = useState(0.7);
  const [aiLimit, setAiLimit] = useState(100);

  // Stats calculation
  const totalStudents = usersList.filter(u => u.role === 'Student').length;
  const totalTeachers = usersList.filter(u => u.role === 'Teacher').length;
  const premiumUsersCount = usersList.filter(u => u.subscription === 'Premium' && u.role === 'Student').length;
  const totalFilesCount = resources.length;
  
  // Derived analytical metrics
  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);
  const projectedRevenue = premiumUsersCount * 299;

  // Recent activities logger mockup
  const [activities, setActivities] = useState([
    { text: 'Prof. Ramesh Patil uploaded dynamic lecture slides on Theory of Computation', time: '10 mins ago' },
    { text: 'Student Amit Sharma upgraded to Premium subscription pack', time: '1 hour ago' },
    { text: 'System initialized new safety checks on Vault AI module', time: '3 hours ago' },
    { text: 'Board previous year solved mathematics paper parsed by professor', time: '5 hours ago' }
  ]);

  const addActivity = (text: string) => {
    setActivities([{ text, time: 'Just now' }, ...activities.slice(0, 5)]);
  };

  // Toggle user activation state
  const toggleUserVerification = (uid: string) => {
    const updated = usersList.map(u => {
      if (u.uid === uid) {
        const nextState = !u.emailVerified;
        addActivity(`Admin ${nextState ? 'Activated' : 'Deactivated'} account: ${u.name}`);
        return { ...u, emailVerified: nextState };
      }
      return u;
    });
    onUpdateUsersList(updated);
  };

  // Toggle premium subscription state
  const toggleUserPremium = (uid: string) => {
    const updated = usersList.map(u => {
      if (u.uid === uid) {
        const nextSub = u.subscription === 'Premium' ? 'Free' : 'Premium';
        addActivity(`Admin toggled ${nextSub} subscription status for student: ${u.name}`);
        return { ...u, subscription: nextSub as 'Free' | 'Premium' };
      }
      return u;
    });
    onUpdateUsersList(updated);
  };

  // Delete user account
  const handleDeleteUser = (uid: string, name: string) => {
    if (confirm(`Are you absolutely sure you want to permanently delete user "${name}" from Firestore database records?`)) {
      const updated = usersList.filter(u => u.uid !== uid);
      onUpdateUsersList(updated);
      addActivity(`Admin permanently deleted user node: ${name}`);
      alert(`User ${name} has been deleted successfully.`);
    }
  };

  // Upload premium resource handler (forced premium)
  const handleAdminResourceUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTitle || !adminSubject || !adminFileName) return;

    setIsUploading(true);

    setTimeout(() => {
      const newResource: ResourceItem = {
        documentId: `res-admin-${Date.now()}`,
        title: `[PREMIUM ONLY] ${adminTitle}`,
        description: `Official High-Quality Solved premium study material covering ${adminSubject}. Sourced directly by CampusVault Admin.`,
        subject: adminSubject,
        branch: adminBranch,
        semester: adminSemester,
        type: adminUploadType,
        fileName: adminFileName,
        fileUrl: '#',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400',
        uploadedBy: 'Admin Team',
        uploaderId: user.uid,
        premium: true, // forced premium as asked
        downloads: 12,
        views: 45,
        createdAt: new Date().toISOString()
      };

      onUpdateResources([newResource, ...resources]);
      addActivity(`Admin uploaded Premium study material: ${adminTitle}`);
      
      // Reset Form
      setAdminTitle('');
      setAdminSubject('');
      setAdminFileName('');
      setIsUploading(false);

      alert(`🎉 Premium study resource "${adminTitle}" uploaded successfully to secure Cloud bucket!`);
      setActiveTab('resources');
    }, 1200);
  };

  const handleResourceDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = resources.filter(r => r.documentId !== id);
      onUpdateResources(updated);
      addActivity(`Admin deleted catalog resource: ${title}`);
      alert('Resource deleted successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col pb-24 md:pb-6 font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#050816]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white block">CAMPUSVAULT</span>
            <span className="text-[10px] text-amber-400 font-bold">Admin Console</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wide">Predefined Root Admin</span>
            <span className="text-xs font-bold text-white">{user.name}</span>
          </div>
          <button 
            onClick={onLogout}
            className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/10 hover:bg-red-600/20 text-red-400 flex items-center justify-center cursor-pointer transition-colors"
            title="Log out from console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ADMIN SUB-TABS */}
      <div className="border-b border-white/5 bg-[#162544]/30 px-6 py-2 flex gap-3 overflow-x-auto">
        {[
          { key: 'analytics', label: 'Console Analytics', icon: BarChart3 },
          { key: 'users', label: 'Manage Student / Teachers', icon: Users },
          { key: 'resources', label: 'Resource Management', icon: BookOpen },
          { key: 'ai-settings', label: 'Global AI Tune-up', icon: Sliders }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 cursor-pointer transition-all ${
                isActive 
                  ? 'bg-amber-500 text-[#050816] shadow-md shadow-amber-500/10' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* ADMIN STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-[#162544]/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Total Students</span>
                    <span className="text-2xl font-black text-white mt-1 block">{totalStudents}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-[#2563EB] border border-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#162544]/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Total Teachers</span>
                    <span className="text-2xl font-black text-white mt-1 block">{totalTeachers}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-[#22D3EE] border border-cyan-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#162544]/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Premium Users</span>
                    <span className="text-2xl font-black text-amber-400 mt-1 block">{premiumUsersCount}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 fill-amber-400" />
                  </div>
                </div>

                <div className="bg-[#162544]/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Uploaded Files</span>
                    <span className="text-2xl font-black text-white mt-1 block">{totalFilesCount}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#162544]/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Projected Revenue</span>
                    <span className="text-2xl font-black text-[#10B981] mt-1 block">₹{projectedRevenue}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-[#10B981] border border-emerald-500/20 flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* PROJECT ANALYTICS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* REVENUE & RESOURCE ANALYTICS */}
                <div className="lg:col-span-8 bg-[#162544]/80 border border-white/10 rounded-[24px] p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" /> Resource & Revenue Analytics
                  </h3>
                  <div className="h-64 flex items-end justify-between gap-4 pt-6 border-b border-white/10">
                    {[
                      { label: 'Notes (PDF)', val: 40, color: 'bg-blue-500' },
                      { label: 'Slides (PPT)', val: 25, color: 'bg-cyan-400' },
                      { label: 'Video Lecture', val: 75, color: 'bg-red-500' },
                      { label: 'Assignments', val: 50, color: 'bg-orange-500' },
                      { label: 'PYQ papers', val: 90, color: 'bg-purple-500' },
                      { label: 'Premium Vaults', val: 65, color: 'bg-amber-400' }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">{bar.val}%</span>
                        <div 
                          className={`w-full rounded-t-lg transition-all duration-500 hover:opacity-80 ${bar.color}`}
                          style={{ height: `${bar.val}%` }} 
                        />
                        <span className="text-[9px] text-gray-500 tracking-tight block truncate w-full text-center mt-2 font-semibold">
                          {bar.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                    Graph represents student view engagement density across standard course assets and premium vaults (Simulated Server analytics).
                  </p>
                </div>

                {/* ADMIN ACTIVITIES LOGGER */}
                <div className="lg:col-span-4 bg-[#162544]/60 border border-white/10 rounded-[24px] p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#22D3EE]" /> Console Log Activities
                  </h3>

                  <div className="space-y-3 divide-y divide-white/5 max-h-[250px] overflow-y-auto pr-1">
                    {activities.map((act, idx) => (
                      <div key={idx} className="pt-2.5 first:pt-0 space-y-1">
                        <p className="text-[11px] text-gray-300 leading-relaxed font-medium">{act.text}</p>
                        <span className="text-[9px] text-gray-500 block">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* USER MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <SectionTitle title="Manage Educational Profiles" subtitle="Review permissions, activate/deactivate nodes, and grant/revoke Premium access" />

              <div className="bg-[#162544]/60 border border-white/10 rounded-[20px] overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#162544] border-b border-white/5 text-gray-400 font-bold">
                      <th className="p-4">User Details</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">Metadata Scope</th>
                      <th className="p-4">Account Status</th>
                      <th className="p-4">Subscription</th>
                      <th className="p-4 text-right">Console Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.map((u) => (
                      <tr key={u.uid} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-white block">{u.name}</span>
                          <span className="text-[10px] text-gray-500">{u.email}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'Admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            u.role === 'Teacher' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">
                          {u.role === 'Student' ? (
                            <span>{u.branch} • {u.semester}</span>
                          ) : (
                            <span className="text-gray-500">Institution Wide</span>
                          )}
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleUserVerification(u.uid)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold cursor-pointer ${
                              u.emailVerified 
                                ? 'bg-emerald-500/10 text-[#10B981] border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {u.emailVerified ? 'Active (Verified)' : 'Deactivated'}
                          </button>
                        </td>
                        <td className="p-4">
                          {u.role === 'Student' ? (
                            <button
                              onClick={() => toggleUserPremium(u.uid)}
                              className="cursor-pointer"
                              title="Click to toggle plan"
                            >
                              {u.subscription === 'Premium' ? (
                                <PremiumBadge />
                              ) : (
                                <span className="text-gray-500 bg-white/5 px-2 py-0.5 rounded font-bold uppercase text-[9px] tracking-wide border border-white/5 hover:border-amber-500/20 hover:text-amber-300 transition-all">
                                  Free Pack
                                </span>
                              )}
                            </button>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {u.role !== 'Admin' ? (
                            <button
                              onClick={() => handleDeleteUser(u.uid, u.name)}
                              className="p-1.5 rounded bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-all cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-medium">Root Secure</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* RESOURCE CONTROL & UPLOAD TAB */}
          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* UPLOAD FORM (LEFT) */}
              <div className="lg:col-span-5 space-y-4">
                <SectionTitle title="Secure Premium Publisher" subtitle="Forced premium lecture nodes" />
                <GlassCard hoverEffect={false}>
                  <form onSubmit={handleAdminResourceUpload} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Asset Category</label>
                      <select 
                        value={adminUploadType} 
                        onChange={(e) => setAdminUploadType(e.target.value as ResourceType)}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                      >
                        <option value="PDF">Premium Notes (PDF)</option>
                        <option value="Video">Premium Video Playlist</option>
                        <option value="Question Paper">Premium Question Bank (PYQ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Material Name / Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Fluids Mechanics Chapter 4 Notes"
                        value={adminTitle}
                        onChange={(e) => setAdminTitle(e.target.value)}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Syllabus Subject</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Fluid Mechanics"
                        value={adminSubject}
                        onChange={(e) => setAdminSubject(e.target.value)}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Branch</label>
                        <select 
                          value={adminBranch} 
                          onChange={(e) => setAdminBranch(e.target.value)}
                          className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                        >
                          <option>Computer Engineering</option>
                          <option>Electrical Engineering</option>
                          <option>Mechanical Engineering</option>
                          <option>Civil Engineering</option>
                          <option>Electronics & Telecommunication</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 font-bold mb-1">Semester</label>
                        <select 
                          value={adminSemester} 
                          onChange={(e) => setAdminSemester(e.target.value)}
                          className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                        >
                          <option>1st Semester</option>
                          <option>2nd Semester</option>
                          <option>3rd Semester</option>
                          <option>4th Semester</option>
                          <option>5th Semester</option>
                          <option>6th Semester</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold mb-1">Source File Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. premium_fluid_mach.pdf"
                        value={adminFileName}
                        onChange={(e) => setAdminFileName(e.target.value)}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                        required
                      />
                    </div>

                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-[11px] leading-relaxed">
                      💡 Uploading resources via the Admin portal forces them as <strong>Premium Material</strong>. Free students must unlock Premium plan to view them.
                    </div>

                    <GradientButton 
                      type="submit" 
                      variant="premium" 
                      loading={isUploading} 
                      className="w-full py-3 font-bold"
                    >
                      Publish Premium Asset
                    </GradientButton>
                  </form>
                </GlassCard>
              </div>

              {/* CATALOG LIST (RIGHT) */}
              <div className="lg:col-span-7 space-y-4">
                <SectionTitle title="Live Resource Moderation" subtitle="Purge and view database nodes" />
                <div className="bg-[#162544]/60 border border-white/10 rounded-[20px] p-4 divide-y divide-white/5 max-h-[500px] overflow-y-auto">
                  {resources.map((res) => (
                    <div key={res.documentId} className="py-3 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">{res.type}</span>
                        <span className="text-xs font-bold text-white block truncate max-w-[250px]">{res.title}</span>
                        <span className="text-[10px] text-gray-400 block">{res.subject} • {res.branch}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {res.premium ? (
                          <PremiumBadge />
                        ) : (
                          <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">Free</span>
                        )}
                        <button 
                          onClick={() => handleResourceDelete(res.documentId, res.title)}
                          className="p-1.5 rounded bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* GLOBAL AI TUNE-UP TAB */}
          {activeTab === 'ai-settings' && (
            <motion.div
              key="ai-settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto"
            >
              <SectionTitle title="Global AI Settings" subtitle="Tweak and monitor model parameters and constraints" />

              <GlassCard hoverEffect={false} className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-amber-500" /> Model Hyperparameters (Simulated)
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Set limits for Gemini API requests and configure default model behavior on CampusVault (Gramin Study Point).
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-gray-300">Model Temperature</label>
                      <span className="text-amber-400 font-bold text-xs">{aiTemp}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1" 
                      step="0.1" 
                      value={aiTemp}
                      onChange={(e) => setAiTemp(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 bg-[#050816] h-1.5 rounded-full"
                    />
                    <div className="flex justify-between text-[9px] text-gray-500">
                      <span>Strict / Academic (0.1)</span>
                      <span>Balanced (0.7)</span>
                      <span>Creative / Code Advice (1.0)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-gray-300">AI Daily Free Request Limit</label>
                      <span className="text-amber-400 font-bold text-xs">{aiLimit} calls</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="500" 
                      step="5" 
                      value={aiLimit}
                      onChange={(e) => setAiLimit(parseInt(e.target.value))}
                      className="w-full accent-amber-500 bg-[#050816] h-1.5 rounded-full"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 leading-relaxed">
                    🔒 <strong>Security Override active</strong>: Only students with verified profiles and Premium tier are allowed to make roadmap, summarize notes, and mock quiz creation requests to protect project API credentials.
                  </div>

                  <GradientButton 
                    onClick={() => {
                      alert('Global Vault AI configurations applied successfully (simulated)! Temperature updated to ' + aiTemp + '.');
                      addActivity(`Admin modified global AI parameter temperature: ${aiTemp}`);
                    }} 
                    variant="premium" 
                    className="w-full py-3"
                  >
                    Apply New Parameters
                  </GradientButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
};
