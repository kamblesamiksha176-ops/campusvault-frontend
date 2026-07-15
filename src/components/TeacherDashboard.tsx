import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Trash2, 
  FileText, 
  FileSpreadsheet, 
  Video, 
  FileDown, 
  Plus, 
  Users, 
  BookOpen, 
  Eye, 
  Download, 
  Edit3, 
  LogOut, 
  Check, 
  X, 
  Bell, 
  Settings,
  Sparkles,
  Info,
  GraduationCap
} from 'lucide-react';
import { UserProfile, ResourceItem, ResourceType } from '../types';
import { GlassCard, GradientButton, PremiumBadge, SectionTitle } from './UIElements';

interface TeacherDashboardProps {
  user: UserProfile;
  resources: ResourceItem[];
  onLogout: () => void;
  onUpdateResources: (updated: ResourceItem[]) => void;
  onPostAnnouncement: (title: string, content: string) => void;
  studentCount: number;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  resources,
  onLogout,
  onUpdateResources,
  onPostAnnouncement,
  studentCount
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'upload' | 'notices'>('overview');
  
  // Notice state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [isNoticePosting, setIsNoticePosting] = useState(false);

  // Upload Form state
  const [uploadType, setUploadType] = useState<ResourceType>('PDF');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadSemester, setUploadSemester] = useState('3rd Semester');
  const [uploadBranch, setUploadBranch] = useState('Computer Engineering');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadPremium, setUploadPremium] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Edit State
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);

  // Filter teacher's own uploaded resources
  const ownResources = resources.filter(res => res.uploaderId === user.uid || res.uploadedBy === user.name);

  // Stats calculation
  const totalDownloads = ownResources.reduce((sum, r) => sum + r.downloads, 0);
  const totalViews = ownResources.reduce((sum, r) => sum + r.views, 0);

  // Handle resource upload simulation
  const handleResourceUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadSubject || !uploadFileName) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      const newResource: ResourceItem = {
        documentId: `res-${Date.now()}`,
        title: uploadTitle,
        description: uploadDescription || `Comprehensive review of ${uploadSubject} concepts. Created specifically for diploma curriculum.`,
        subject: uploadSubject,
        branch: uploadBranch,
        semester: uploadSemester,
        type: uploadType,
        fileName: uploadFileName,
        fileUrl: uploadType === 'Video' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : '#',
        thumbnail: uploadType === 'Video' 
          ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400'
          : uploadType === 'PDF'
          ? 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400'
          : 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400',
        uploadedBy: user.name,
        uploaderId: user.uid,
        premium: uploadPremium,
        downloads: 0,
        views: 0,
        createdAt: new Date().toISOString()
      };

      onUpdateResources([newResource, ...resources]);
      
      // Reset Form
      setUploadTitle('');
      setUploadSubject('');
      setUploadDescription('');
      setUploadFileName('');
      setUploadPremium(false);
      setIsUploading(false);
      
      alert('🎉 Study Material uploaded successfully to Firebase Storage and indexed in Firestore! It is now instantly visible to students.');
      setActiveTab('resources');
    }, 1500);
  };

  // Handle Edit Resource Update
  const handleResourceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    const updated = resources.map(res => {
      if (res.documentId === editingResource.documentId) {
        return editingResource;
      }
      return res;
    });

    onUpdateResources(updated);
    setEditingResource(null);
    alert('Resource information updated successfully!');
  };

  // Handle Resource Deletion
  const handleResourceDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this resource from the server storage? This action cannot be undone.')) {
      const updated = resources.filter(res => res.documentId !== id);
      onUpdateResources(updated);
      alert('Resource deleted successfully from database.');
    }
  };

  // Handle Notice Posting Simulation
  const handleNoticePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    setIsNoticePosting(true);
    setTimeout(() => {
      onPostAnnouncement(noticeTitle, noticeContent);
      setNoticeTitle('');
      setNoticeContent('');
      setIsNoticePosting(false);
      alert('Notice dispatched successfully to students! Check the announcement board on the student dashboard.');
      setActiveTab('overview');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col pb-24 md:pb-6 font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#050816]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white block">CAMPUSVAULT</span>
            <span className="text-[10px] text-[#22D3EE] font-bold">Teacher Terminal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Authorized Educator</span>
            <span className="text-xs font-bold text-white">{user.name}</span>
          </div>
          <button 
            onClick={onLogout}
            className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/10 hover:bg-red-600/20 text-red-400 flex items-center justify-center cursor-pointer transition-colors"
            title="Log out of Terminal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* TABS SIDEBAR / MENU BAR */}
      <div className="border-b border-white/5 bg-[#162544]/30 px-6 py-2 flex gap-3 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview & Statistics', icon: BookOpen },
          { key: 'resources', label: 'My Uploaded Files', icon: FileText },
          { key: 'upload', label: 'Upload Study Material', icon: Upload },
          { key: 'notices', label: 'Post Class Notice', icon: Bell }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
                setEditingResource(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 cursor-pointer transition-all ${
                isActive 
                  ? 'bg-[#22D3EE] text-[#050816] shadow-md shadow-[#22D3EE]/10' 
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

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Stat Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#162544]/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Assigned Branch Users</span>
                    <span className="text-2xl font-black text-white mt-1 block">{studentCount} Students</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-[#2563EB] border border-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#162544]/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Uploaded Resource Cards</span>
                    <span className="text-2xl font-black text-white mt-1 block">{ownResources.length} Materials</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-[#22D3EE] border border-cyan-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#162544]/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Cumulative Downloads</span>
                    <span className="text-2xl font-black text-white mt-1 block">{totalDownloads} Times</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-[#10B981] border border-emerald-500/20 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#162544]/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Cumulative Views</span>
                    <span className="text-2xl font-black text-white mt-1 block">{totalViews} Impressions</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-[#F59E0B] border border-amber-500/20 flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Notice Brief & Dynamic upload shortcuts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload shortcuts */}
                <div className="space-y-4">
                  <SectionTitle title="Quick Material Publisher" subtitle="Instantly provision study folders" />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: 'PDF', label: 'Upload PDF Notes', color: 'hover:border-blue-500/50 text-blue-400' },
                      { type: 'PPT', label: 'Upload PowerPoint', color: 'hover:border-cyan-500/50 text-cyan-400' },
                      { type: 'Video', label: 'Link Video Lecture', color: 'hover:border-red-500/50 text-red-400' },
                      { type: 'Assignment', label: 'Post Solved Assignment', color: 'hover:border-orange-500/50 text-orange-400' },
                      { type: 'Question Paper', label: 'Add Board PYQ Paper', color: 'hover:border-purple-500/50 text-purple-400' }
                    ].map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setUploadType(btn.type as ResourceType);
                          setActiveTab('upload');
                        }}
                        className={`p-4 rounded-xl border border-white/5 bg-[#162544]/40 text-left text-xs font-bold transition-all flex flex-col justify-between h-24 cursor-pointer ${btn.color}`}
                      >
                        <Plus className="w-5 h-5 opacity-70" />
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recently Shared Materials (Mini-List) */}
                <div className="space-y-4">
                  <SectionTitle title="Latest Resource Activity" subtitle="Your recently compiled study sheets" />
                  <div className="bg-[#162544]/60 border border-white/10 rounded-2xl p-5 divide-y divide-white/5 space-y-3">
                    {ownResources.length > 0 ? (
                      ownResources.slice(0, 3).map((res) => (
                        <div key={res.documentId} className="pt-3 first:pt-0 flex justify-between items-center gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#22D3EE] font-bold block">{res.subject}</span>
                            <span className="text-xs font-bold text-white block line-clamp-1">{res.title}</span>
                            <span className="text-[10px] text-gray-500">{new Date(res.createdAt).toLocaleDateString()} • {res.type}</span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setEditingResource(res); setActiveTab('resources'); }} 
                              className="text-[10px] text-[#22D3EE] bg-white/5 px-2 py-1 rounded"
                            >
                              Edit Info
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-6">You have not uploaded any resources yet. Use the Upload tab to add material.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MY RESOURCE MANAGEMENT TAB */}
          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {editingResource ? (
                // EDIT COMPONENT FORM
                <div className="bg-[#162544]/80 border border-white/10 rounded-[24px] p-6 max-w-xl mx-auto space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <h3 className="text-base font-bold text-[#22D3EE]">Update Resource Information</h3>
                    <button onClick={() => setEditingResource(null)} className="text-gray-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleResourceUpdate} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-gray-400 font-semibold mb-1">Resource Title</label>
                      <input 
                        type="text" 
                        value={editingResource.title}
                        onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 font-semibold mb-1">Subject Name</label>
                        <input 
                          type="text" 
                          value={editingResource.subject}
                          onChange={(e) => setEditingResource({ ...editingResource, subject: e.target.value })}
                          className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 font-semibold mb-1">File Name</label>
                        <input 
                          type="text" 
                          value={editingResource.fileName}
                          onChange={(e) => setEditingResource({ ...editingResource, fileName: e.target.value })}
                          className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 font-semibold mb-1">Detailed Description</label>
                      <textarea
                        rows={3}
                        value={editingResource.description}
                        onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                      <input 
                        type="checkbox" 
                        id="editPremiumCheck"
                        checked={editingResource.premium}
                        onChange={(e) => setEditingResource({ ...editingResource, premium: e.target.checked })}
                        className="w-4 h-4 rounded text-[#22D3EE]"
                      />
                      <label htmlFor="editPremiumCheck" className="text-gray-300 font-medium">
                        Set as Premium Material (Requires paid student subscription)
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <GradientButton type="submit" variant="success" className="flex-1 py-2.5">
                        Save Changes
                      </GradientButton>
                      <button 
                        type="button" 
                        onClick={() => setEditingResource(null)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // RESOURCES LIST
                <div className="space-y-4">
                  <SectionTitle title="Uploaded Files Catalog" subtitle="Verify and delete published education vectors" />
                  
                  {ownResources.length > 0 ? (
                    <div className="bg-[#162544]/60 border border-white/10 rounded-[20px] overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#162544] border-b border-white/5 text-gray-400 font-semibold">
                            <th className="p-4">Resource Details</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Syllabus Scope</th>
                            <th className="p-4">Stats</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {ownResources.map((res) => (
                            <tr key={res.documentId} className="hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <span className="font-bold text-white block">{res.title}</span>
                                <span className="text-[10px] text-gray-500">{res.fileName}</span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] uppercase tracking-wide inline-flex items-center gap-1 ${
                                  res.premium ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/5 text-gray-300'
                                }`}>
                                  {res.premium && <Sparkles className="w-2.5 h-2.5 fill-current" />}
                                  {res.type}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-gray-300 block">{res.subject}</span>
                                <span className="text-[10px] text-gray-500">{res.branch} • {res.semester}</span>
                              </td>
                              <td className="p-4 text-gray-400">
                                <span>{res.downloads} Dn • {res.views} Views</span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="inline-flex gap-2">
                                  <button 
                                    onClick={() => setEditingResource(res)}
                                    className="p-1.5 rounded bg-[#22D3EE]/10 text-[#22D3EE] hover:bg-[#22D3EE]/20"
                                    title="Edit Metadata"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleResourceDelete(res.documentId)}
                                    className="p-1.5 rounded bg-red-600/10 text-red-400 hover:bg-red-600/20"
                                    title="Delete Material"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-[#162544]/20 rounded-2xl border border-white/5">
                      <p className="text-xs text-gray-500">No resources found. Upload documents to populate your educator list.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* UPLOAD STUDY RESOURCE TAB */}
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto"
            >
              <SectionTitle title="Simulated Publisher Tool" subtitle="Documents compile instantly to user search dashboards" />

              <GlassCard hoverEffect={false} className="p-6">
                <form onSubmit={handleResourceUpload} className="space-y-4 text-xs">
                  
                  {/* Select Type */}
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Material Asset Type</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { type: 'PDF', label: 'PDF Notes' },
                        { type: 'PPT', label: 'PPT Slides' },
                        { type: 'Video', label: 'Video link' },
                        { type: 'Assignment', label: 'Assignment' },
                        { type: 'Question Paper', label: 'PYQ paper' }
                      ].map((item) => {
                        const isSel = uploadType === item.type;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => setUploadType(item.type as ResourceType)}
                            className={`py-2 px-1 rounded-xl font-bold text-center border transition-all ${
                              isSel 
                                ? 'bg-gradient-to-r from-[#2563EB] to-[#22D3EE] border-transparent text-white' 
                                : 'bg-[#050816] hover:bg-white/5 border-white/5 text-gray-400'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Resource Display Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Adv Java Unit 2 Servlet Notes"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#22D3EE]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Syllabus Subject Area</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Advanced Java Programming"
                        value={uploadSubject}
                        onChange={(e) => setUploadSubject(e.target.value)}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#22D3EE]"
                        required
                      />
                    </div>
                  </div>

                  {/* Branch & Semester */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Syllabus Branch</label>
                      <select 
                        value={uploadBranch}
                        onChange={(e) => setUploadBranch(e.target.value)}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#22D3EE]"
                      >
                        <option>Computer Engineering</option>
                        <option>Electrical Engineering</option>
                        <option>Mechanical Engineering</option>
                        <option>Civil Engineering</option>
                        <option>Electronics & Telecommunication</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Target Semester</label>
                      <select 
                        value={uploadSemester}
                        onChange={(e) => setUploadSemester(e.target.value)}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#22D3EE]"
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

                  {/* File Upload Simulation */}
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Selected File Name</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="e.g. adv_java_not_unit2.pdf"
                        value={uploadFileName}
                        onChange={(e) => setUploadFileName(e.target.value)}
                        className="flex-1 bg-[#050816] border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const randomNames = [
                            'Notes_Fluid_Mechanics_v3.pdf',
                            'Theory_of_Computation_Revisions.pptx',
                            'Basic_Electrical_Solved_PYQ.pdf',
                            'Lab_Manual_Microprocessors.pdf',
                            'Digital_Communication_Formulas.pdf'
                          ];
                          const randomVal = randomNames[Math.floor(Math.random() * randomNames.length)];
                          setUploadFileName(randomVal);
                        }} 
                        className="px-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10"
                      >
                        Auto
                      </button>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Detailed Summary/Description</label>
                    <textarea
                      rows={3}
                      placeholder="Brief details or chapters covered in this file..."
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#22D3EE]"
                    />
                  </div>

                  {/* Premium Access Toggle */}
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <input 
                      type="checkbox" 
                      id="premiumToggleCheck" 
                      checked={uploadPremium}
                      onChange={(e) => setUploadPremium(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-[#22D3EE] bg-[#050816]"
                    />
                    <label htmlFor="premiumToggleCheck" className="text-xs text-gray-300 font-semibold flex items-center gap-1.5 cursor-pointer">
                      Publish to Premium Vault ONLY <PremiumBadge />
                    </label>
                  </div>

                  {/* Submit Button */}
                  <GradientButton 
                    type="submit" 
                    variant="accent" 
                    loading={isUploading} 
                    className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs"
                    icon={<Upload className="w-4 h-4" />}
                  >
                    Simulate Firebase Upload
                  </GradientButton>

                </form>
              </GlassCard>
            </motion.div>
          )}

          {/* POST CLASS NOTICE TAB */}
          {activeTab === 'notices' && (
            <motion.div
              key="notices"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto"
            >
              <SectionTitle title="Broadcast Notice" subtitle="Notices are published to the global announcements board immediately" />

              <GlassCard hoverEffect={false}>
                <form onSubmit={handleNoticePost} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Notice Title / Headline</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Unit Test Re-scheduled or Submissions Due"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#22D3EE]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wide text-[10px]">Notice Content</label>
                    <textarea
                      rows={5}
                      placeholder="Enter the comprehensive notice guidelines to broadcast..."
                      value={noticeContent}
                      onChange={(e) => setNoticeContent(e.target.value)}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#22D3EE]"
                      required
                    />
                  </div>

                  <GradientButton 
                    type="submit" 
                    variant="primary" 
                    loading={isNoticePosting}
                    className="w-full py-3 rounded-xl font-bold"
                  >
                    Post Announcement Notice
                  </GradientButton>
                </form>
              </GlassCard>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
};
