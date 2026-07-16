import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  BookOpen, 
  Video, 
  HelpCircle, 
  FileText, 
  Award, 
  Sparkles, 
  Download, 
  Bookmark, 
  User, 
  Bell, 
  LogOut, 
  Send, 
  Brain, 
  Compass, 
  FileDown, 
  Play, 
  Flame,
  CheckCircle2,
  X,
  Plus,
  BookMarked,
  Info,
  ExternalLink,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { UserProfile, ResourceItem, QuizItem, NotificationItem, ChatMessage, ResourceType } from '../types';
import { GlassCard, GradientButton, PremiumBadge, SectionTitle } from './UIElements';

interface StudentDashboardProps {
  user: UserProfile;
  resources: ResourceItem[];
  quizzes: QuizItem[];
  notifications: NotificationItem[];
  announcements: { id: string; title: string; content: string; postedBy: string; createdAt: string }[];
  leaderboard: { rank: number; name: string; points: number; college: string; avatar: string }[];
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  onUpdateResources: (updated: ResourceItem[]) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  resources,
  quizzes,
  notifications,
  announcements,
  leaderboard,
  onUpdateUser,
  onLogout,
  onUpdateResources
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'ai' | 'downloads' | 'profile'>('home');
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem(`bookmarks_${user.uid}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [downloadedIds, setDownloadedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`downloads_${user.uid}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Vault AI State
  const [aiMode, setAiMode] = useState<'chat' | 'explain' | 'roadmap' | 'summarize' | 'quiz'>('chat');
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      id: 'ai-init',
      sender: 'assistant',
      text: `Hello ${user.name}! I am Vault AI, your smart study assistant. How can I help you today?\n\nI can:\n- Answer core engineering and coding questions\n- Break down complex concepts into analogies & formulas\n- Create tailored learning roadmaps\n- Summarize chapters and study notes\n- Generate interactive subject-wise quizzes!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Custom tool inputs
  const [explainTopic, setExplainTopic] = useState('');
  const [roadmapCareer, setRoadmapCareer] = useState('');
  const [summarizeText, setSummarizeText] = useState('');
  const [quizSubject, setQuizSubject] = useState('');
  
  // Custom Quiz taking state
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // Modals
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [viewingResource, setViewingResource] = useState<ResourceItem | null>(null);
  const [activeNotification, setActiveNotification] = useState<NotificationItem | null>(null);

  // Persist Bookmarks
  useEffect(() => {
    localStorage.setItem(`bookmarks_${user.uid}`, JSON.stringify(bookmarks));
  }, [bookmarks, user.uid]);

  // Persist Downloads
  useEffect(() => {
    localStorage.setItem(`downloads_${user.uid}`, JSON.stringify(downloadedIds));
  }, [downloadedIds, user.uid]);

  // Handle Bookmarking
  const toggleBookmark = (id: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(b => b !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  // Greeting based on hours
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Premium Access Guard
  const handlePremiumAction = (action: () => void, isPremiumRequired: boolean) => {
    if (isPremiumRequired && user.subscription !== 'Premium') {
      setShowPremiumModal(true);
    } else {
      action();
    }
  };

  // Perform Offline Download Simulation
  const handleDownloadResource = (resource: ResourceItem) => {
    const downloadAction = () => {
      if (downloadedIds.includes(resource.documentId)) {
        alert(`${resource.title} is already available in your Offline Downloads.`);
        return;
      }
      
      // Save
      setDownloadedIds([...downloadedIds, resource.documentId]);
      
      // Update download count on global resource
      const updated = resources.map(res => {
        if (res.documentId === resource.documentId) {
          return { ...res, downloads: res.downloads + 1 };
        }
        return res;
      });
      onUpdateResources(updated);
      
      alert(`"${resource.title}" downloaded successfully! You can access it anytime in the "Downloads" tab without an internet connection.`);
    };

    handlePremiumAction(downloadAction, resource.premium);
  };

  // View PDF or PPT document
  const handleViewResource = (resource: ResourceItem) => {
    const viewAction = () => {
      // Update views
      const updated = resources.map(res => {
        if (res.documentId === resource.documentId) {
          return { ...res, views: res.views + 1 };
        }
        return res;
      });
      onUpdateResources(updated);
      setViewingResource(resource);
    };

    handlePremiumAction(viewAction, resource.premium);
  };

  // Premium activation simulation
  const handleUpgradeToPremium = () => {
    const updatedUser: UserProfile = {
      ...user,
      subscription: 'Premium'
    };
    onUpdateUser(updatedUser);
    setShowPremiumModal(false);
    alert("🎉 Congratulations! You have successfully unlocked CampusVault Premium! You now have unlimited access to mock tests, Premium Notes, videos, and Vault AI.");
  };

  // Call API for Vault AI Action
  const runAiAction = async (type: 'chat' | 'explain' | 'roadmap' | 'summarize', textInput: string) => {
    if (!textInput.trim()) return;

    // Check premium limits on AI if applicable
    if (user.subscription !== 'Premium' && type !== 'chat' && type !== 'explain') {
      setShowPremiumModal(true);
      return;
    }

    setAiLoading(true);

    try {
      const response = await fetch("https://campusvault-backend-2.onrender.com/api/ai/action", ...), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: type,
          prompt: textInput
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      if (type === 'chat') {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAiMessages(prev => [...prev, assistantMsg]);
      } else {
        // For other tools, add a chat-like box for results
        const resultMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `### Result for Vault AI ${type.toUpperCase()}:\n\n${data.text}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAiMessages(prev => [...prev, resultMsg]);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Vault AI Error: ${err.message || 'Please verify your GEMINI_API_KEY is configured in Settings > Secrets.'}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: aiChatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages(prev => [...prev, userMsg]);
    const promptToSend = aiChatInput;
    setAiChatInput('');
    runAiAction('chat', promptToSend);
  };

  // Generate Interactive AI Quiz
  const handleGenerateQuiz = async (subject: string) => {
    if (!subject.trim()) return;
    
    // Premium Guard
    if (user.subscription !== 'Premium') {
      setShowPremiumModal(true);
      return;
    }

    setAiLoading(true);
    setGeneratedQuiz(null);
    setQuizFinished(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);

    try {
const response = await fetch(
  "https://campusvault-backend-2.onrender.com/api/ai/generate-quiz",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject,
      branch: user.branch,
      semester: user.semester,
    }),
  }
);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedQuiz({
        quizId: `ai-quiz-${Date.now()}`,
        title: data.title || `${subject} Dynamic Quiz`,
        questions: data.questions || [],
        branch: user.branch || 'General',
        semester: user.semester || 'General'
      });
    } catch (err: any) {
      console.error(err);
      alert(`Quiz Generation Failed: ${err.message || 'Error communicating with AI model. Please verify API key.'}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Filtered resources for search tab & home suggestions
  const getFilteredResources = () => {
    return resources.filter(res => {
      const matchesSearch = searchQuery === '' || 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSemester = selectedSemester === 'All' || res.semester === selectedSemester;
      const matchesBranch = selectedBranch === 'All' || res.branch === selectedBranch;
      const matchesType = selectedType === 'All' || res.type === selectedType;

      return matchesSearch && matchesSemester && matchesBranch && matchesType;
    });
  };

  const filteredResources = getFilteredResources();

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col pb-24 md:pb-6 font-sans">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[50%] right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER BAR */}
      <header className="sticky top-0 z-30 bg-[#050816]/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
            <GraduationCap className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white block">CAMPUSVAULT</span>
            <span className="text-[10px] text-gray-400 font-medium">Gramin Study Point</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => setActiveNotification(notifications[0] || null)}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4 text-gray-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#22D3EE] rounded-full animate-ping" />
            </button>
          </div>

          {/* Premium Chip */}
          {user.subscription === 'Premium' ? (
            <PremiumBadge />
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowPremiumModal(true)}
              className="text-xs bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#050816] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#050816]" /> Go Premium
            </motion.button>
          )}

          {/* User Brief */}
          <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 px-3">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 text-[#22D3EE] flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold">{user.name}</span>
          </div>
        </div>
      </header>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* TOP GREETING */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#162544]/60 to-[#162544]/20 p-6 rounded-[24px] border border-white/5 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-full bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    {getGreeting()}, {user.name} 👋
                  </h1>
                  <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-xl">
                    Welcome to Gramin Study Point. Access study vaults, test your intelligence with custom AI Quizzes, or learn with Vault AI.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#22D3EE]">
                    <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">{user.college}</span>
                    <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">{user.branch}</span>
                    <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">{user.semester}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 block">Streak Point</span>
                    <span className="text-xl font-black text-amber-400 flex items-center justify-end gap-1">
                      <Flame className="w-5 h-5 fill-amber-500 text-amber-500" /> 1,250 XP
                    </span>
                  </div>
                </div>
              </div>

              {/* SEARCH BAR (Redirects to Search Tab) */}
              <div 
                onClick={() => setActiveTab('search')} 
                className="bg-[#162544]/60 hover:bg-[#162544]/80 transition-colors border border-white/10 rounded-2xl p-3.5 px-5 flex items-center gap-3 cursor-pointer group"
              >
                <Search className="w-5 h-5 text-gray-400 group-hover:text-[#22D3EE] transition-colors" />
                <span className="text-sm text-gray-500">Search premium notes, PPTs, video lectures, assignments...</span>
              </div>

              {/* QUICK ACTION GRID */}
              <div>
                <SectionTitle title="Smart Study Vaults" subtitle="Navigate straight to educational material categories" />
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                  {[
                    { label: 'Notes', icon: BookOpen, type: 'PDF', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                    { label: 'PPT Slides', icon: FileText, type: 'PPT', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                    { label: 'Video Lectures', icon: Video, type: 'Video', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                    { label: 'Quiz Board', icon: HelpCircle, action: () => { setActiveTab('ai'); setAiMode('quiz'); }, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                    { label: 'Assignments', icon: FileDown, type: 'Assignment', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                    { label: 'Leaderboard', icon: Award, action: () => { alert('You are ranked #1 on the CampusVault Leaderboard with 1,250 points! Keep learning.'); }, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
                    { label: 'PYQ Papers', icon: FileText, type: 'Question Paper', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                    { label: 'Vault AI', icon: Brain, action: () => { setActiveTab('ai'); setAiMode('chat'); }, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/5' }
                  ].map((act, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3, scale: 1.02 }}
                      onClick={() => {
                        if (act.type) {
                          setSelectedType(act.type);
                          setActiveTab('search');
                        } else if (act.action) {
                          act.action();
                        }
                      }}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${act.color}`}
                    >
                      <act.icon className="w-6 h-6 mb-2" />
                      <span className="text-xs font-semibold text-white tracking-tight">{act.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* PREMIUM BANNER (Only shows for free tier) */}
              {user.subscription !== 'Premium' && (
                <GlassCard className="bg-gradient-to-r from-amber-600/20 via-yellow-600/15 to-transparent border-amber-500/30 overflow-hidden" hoverEffect={true}>
                  <div className="absolute top-0 right-0 p-4 opacity-15">
                    <Sparkles className="w-32 h-32 text-amber-400" />
                  </div>
                  <div className="relative z-10 max-w-2xl space-y-3">
                    <PremiumBadge />
                    <h3 className="text-xl font-bold text-white">Unlock Seamless Learning with Premium Vault</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Instant access to handwritten Premium Notes, exam preparation Mock Tests, unlimited Vault AI support (including summary & roadmaps), and offline local resource storage.
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      <GradientButton onClick={() => setShowPremiumModal(true)} variant="premium" className="px-4 py-2 text-xs">
                        Upgrade for ₹299/Semester
                      </GradientButton>
                      <span className="text-[10px] text-gray-400">Cancel or switch anytime. 100% money back guarantee.</span>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* RECENT NOTICES / ANNOUNCEMENTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <SectionTitle title="Campus Announcements" subtitle="Important administrative notices & events" />
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="p-4 rounded-2xl bg-[#162544]/40 border border-white/5 space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="text-sm font-bold text-[#22D3EE]">{ann.title}</h4>
                          <span className="text-[10px] text-gray-500 shrink-0">{new Date(ann.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">{ann.content}</p>
                        <div className="pt-1 flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold">
                          <span>Posted by:</span>
                          <span className="text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">{ann.postedBy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LEADERBOARD BRIEF */}
                <div>
                  <SectionTitle title="Weekly Rankers" subtitle="Highest quiz XP accumulators" />
                  <div className="bg-[#162544]/60 border border-white/10 rounded-2xl p-4 divide-y divide-white/5">
                    {leaderboard.map((leader, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-black w-5 text-center ${
                            leader.rank === 1 ? 'text-amber-400' :
                            leader.rank === 2 ? 'text-gray-300' :
                            leader.rank === 3 ? 'text-amber-600' : 'text-gray-500'
                          }`}>
                            #{leader.rank}
                          </span>
                          <img src={leader.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-white/10" />
                          <div>
                            <span className="text-xs font-bold text-white block">{leader.name}</span>
                            <span className="text-[9px] text-gray-400">{leader.college}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#22D3EE]">{leader.points} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RECENT UPLOADS */}
              <div>
                <SectionTitle title="Recently Shared Resources" subtitle="New notes and videos uploaded by teachers" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.slice(0, 3).map((res) => (
                    <ResourceCard 
                      key={res.documentId} 
                      resource={res} 
                      isBookmarked={bookmarks.includes(res.documentId)}
                      onBookmark={() => toggleBookmark(res.documentId)}
                      onDownload={() => handleDownloadResource(res)}
                      onView={() => handleViewResource(res)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SEARCH & FILTERS TAB */}
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <SectionTitle title="Explore Study Vaults" subtitle="Search and filter through university study sheets and multimedia lectures" />

              {/* FILTER BAR */}
              <div className="bg-[#162544]/80 border border-white/10 rounded-[20px] p-5 space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search by topic, branch, professor, subject name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#050816] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5 text-gray-400 hover:text-white text-xs bg-white/5 px-2 py-0.5 rounded">
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5">Branch / Discipline</label>
                    <select 
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#22D3EE]"
                    >
                      <option>All</option>
                      <option>Computer Engineering</option>
                      <option>Electrical Engineering</option>
                      <option>Mechanical Engineering</option>
                      <option>Civil Engineering</option>
                      <option>Electronics & Telecommunication</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5">Semester</label>
                    <select 
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#22D3EE]"
                    >
                      <option>All</option>
                      <option>1st Semester</option>
                      <option>2nd Semester</option>
                      <option>3rd Semester</option>
                      <option>4th Semester</option>
                      <option>5th Semester</option>
                      <option>6th Semester</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1.5">Material Type</label>
                    <select 
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-[#22D3EE]"
                    >
                      <option>All</option>
                      <option value="PDF">Handwritten Notes (PDF)</option>
                      <option value="PPT">Presentation Slides (PPT)</option>
                      <option value="Video">Video Lectures</option>
                      <option value="Assignment">Solved Assignments</option>
                      <option value="Question Paper">Previous Year Papers</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RESULTS GRID */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Showing <strong>{filteredResources.length}</strong> resources found</span>
                  {(selectedBranch !== 'All' || selectedSemester !== 'All' || selectedType !== 'All' || searchQuery) && (
                    <button 
                      onClick={() => {
                        setSelectedBranch('All');
                        setSelectedSemester('All');
                        setSelectedType('All');
                        setSearchQuery('');
                      }} 
                      className="text-xs text-[#22D3EE] hover:underline"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>

                {filteredResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((res) => (
                      <ResourceCard 
                        key={res.documentId} 
                        resource={res} 
                        isBookmarked={bookmarks.includes(res.documentId)}
                        onBookmark={() => toggleBookmark(res.documentId)}
                        onDownload={() => handleDownloadResource(res)}
                        onView={() => handleViewResource(res)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-[#162544]/20 rounded-2xl border border-white/5 space-y-3">
                    <BookOpen className="w-12 h-12 text-gray-600 mx-auto" />
                    <h3 className="text-base font-bold">No resources match your search</h3>
                    <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                      Try general keywords or check other branch/semester selections. Or ask Vault AI in the next tab to generate mock notes on the topic!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* VAULT AI TAB */}
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Action Menu */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#162544]/80 border border-white/10 rounded-[20px] p-5 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#22D3EE]/10 rounded-xl flex items-center justify-center border border-[#22D3EE]/20 text-[#22D3EE]">
                      <Brain className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Vault AI Module</h3>
                      <p className="text-[10px] text-gray-400">Powered by Gemini 3.5 Flash</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed border-b border-white/5 pb-3">
                    Vault AI is tailored for engineering concepts, career progression roadmaps, study summaries, and interactive quizzes.
                  </p>

                  <div className="flex flex-col gap-2">
                    {[
                      { key: 'chat', label: 'Interactive Study Chat', icon: Send, badge: 'Free' },
                      { key: 'explain', label: 'Explain Concept', icon: Brain, badge: 'Free' },
                      { key: 'roadmap', label: 'Roadmap Generator', icon: Compass, badge: 'Premium' },
                      { key: 'summarize', label: 'Summarize Notes', icon: FileText, badge: 'Premium' },
                      { key: 'quiz', label: 'Generate AI Quiz', icon: HelpCircle, badge: 'Premium' }
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        onClick={() => {
                          if (mode.badge === 'Premium' && user.subscription !== 'Premium') {
                            setShowPremiumModal(true);
                          } else {
                            setAiMode(mode.key as any);
                          }
                        }}
                        className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                          aiMode === mode.key 
                            ? 'bg-gradient-to-r from-[#2563EB] to-[#22D3EE] text-white shadow-lg' 
                            : 'bg-white/5 hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <mode.icon className="w-4 h-4" />
                          <span>{mode.label}</span>
                        </div>
                        {mode.badge === 'Premium' && user.subscription !== 'Premium' && (
                          <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                            PRO
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Suggest Chips */}
                {aiMode === 'chat' && (
                  <div className="p-4 bg-[#162544]/40 border border-white/5 rounded-2xl space-y-3">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Suggested Prompts</span>
                    <div className="flex flex-col gap-2 text-xs">
                      {[
                        'Explain Polymorphism in OOP with a real analogy',
                        'Suggest minor projects for 5th semester Computer Engineering',
                        'Write a simple binary search tree insertion function in Java',
                        'What is the physical meaning of divergence in electromagnetics?'
                      ].map((prompt, i) => (
                        <button 
                          key={i} 
                          onClick={() => setAiChatInput(prompt)}
                          className="text-left p-2.5 rounded-xl bg-[#050816]/60 hover:bg-[#050816] text-gray-300 hover:text-[#22D3EE] border border-white/5 transition-colors text-xs"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main AI Interaction Box */}
              <div className="lg:col-span-8 flex flex-col h-[600px] bg-[#162544]/60 border border-white/10 rounded-[24px] overflow-hidden relative">
                
                {/* INTERACTIVE CHAT MODE */}
                {aiMode === 'chat' && (
                  <>
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col scrollbar-thin scrollbar-thumb-white/10">
                      {aiMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white self-end rounded-tr-none'
                              : 'bg-[#162544] text-gray-200 self-start rounded-tl-none border border-white/5'
                          }`}
                        >
                          <div className="prose prose-invert prose-xs max-w-none whitespace-pre-wrap">
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-gray-400 block text-right mt-1.5 font-medium">{msg.timestamp}</span>
                        </div>
                      ))}

                      {aiLoading && (
                        <div className="bg-[#162544] border border-white/5 text-gray-300 text-xs self-start rounded-2xl rounded-tl-none p-4 max-w-[85%] flex items-center gap-3">
                          <div className="w-2.5 h-2.5 bg-[#22D3EE] rounded-full animate-ping" />
                          <span>Vault AI is formulating your technical answer...</span>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSendChat} className="p-4 border-t border-white/5 bg-[#050816]/60 flex gap-3">
                      <input 
                        type="text" 
                        value={aiChatInput}
                        onChange={(e) => setAiChatInput(e.target.value)}
                        placeholder="Ask Vault AI any question (e.g. explain TCP handshakes)"
                        className="flex-1 bg-[#162544]/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE]"
                      />
                      <GradientButton type="submit" variant="accent" loading={aiLoading} className="py-2.5 px-4 text-xs font-bold shrink-0">
                        Ask AI
                      </GradientButton>
                    </form>
                  </>
                )}

                {/* EXPLAIN CONCEPT MODE */}
                {aiMode === 'explain' && (
                  <div className="p-6 overflow-y-auto h-full space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-[#22D3EE] flex items-center gap-1.5">
                        <Brain className="w-4 h-4" /> Explain Engineering Concept
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Break down a difficult physical or mathematical theory into simple parts, analogies, and formulas.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <input 
                        type="text"
                        placeholder="e.g. Fourier Transform, Kirchhoff's Laws, Redux State Management"
                        value={explainTopic}
                        onChange={(e) => setExplainTopic(e.target.value)}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#22D3EE]"
                      />

                      <GradientButton 
                        onClick={() => runAiAction('explain', explainTopic)} 
                        loading={aiLoading}
                        variant="accent"
                        className="w-full py-3 text-xs font-bold"
                      >
                        Deconstruct Topic
                      </GradientButton>
                    </div>

                    {/* Results display box */}
                    <div className="p-4 rounded-xl bg-[#050816]/40 border border-white/5 text-xs leading-relaxed whitespace-pre-wrap text-gray-300">
                      {aiMessages.filter(m => m.text.includes("Result for Vault AI EXPLAIN")).slice(-1)[0]?.text || "No results generated yet. Enter a topic above."}
                    </div>
                  </div>
                )}

                {/* ROADMAP GENERATOR */}
                {aiMode === 'roadmap' && (
                  <div className="p-6 overflow-y-auto h-full space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                        <Compass className="w-4 h-4" /> Professional Career Roadmap
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Get an ordered, milestone-based learning plan to guide your path to high-paying engineering or software jobs.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <input 
                        type="text"
                        placeholder="e.g. DevOps Engineer, Android App Developer, VLSI Design Engineer"
                        value={roadmapCareer}
                        onChange={(e) => setRoadmapCareer(e.target.value)}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#22D3EE]"
                      />

                      <GradientButton 
                        onClick={() => runAiAction('roadmap', roadmapCareer)} 
                        loading={aiLoading}
                        variant="premium"
                        className="w-full py-3 text-xs font-bold"
                      >
                        Generate Learning Path
                      </GradientButton>
                    </div>

                    <div className="p-4 rounded-xl bg-[#050816]/40 border border-white/5 text-xs leading-relaxed whitespace-pre-wrap text-gray-300">
                      {aiMessages.filter(m => m.text.includes("Result for Vault AI ROADMAP")).slice(-1)[0]?.text || "No path generated yet. Fill details to unlock roadmap."}
                    </div>
                  </div>
                )}

                {/* SUMMARIZE NOTES */}
                {aiMode === 'summarize' && (
                  <div className="p-6 overflow-y-auto h-full space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-blue-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> Summarize Complex Textbook Notes
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Paste a full lecture chapter or book paragraph to extract quick summaries, key formulas, and main takeaways.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <textarea
                        rows={4}
                        placeholder="Paste your study material text here (up to 4000 characters)..."
                        value={summarizeText}
                        onChange={(e) => setSummarizeText(e.target.value)}
                        className="w-full bg-[#050816] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#22D3EE]"
                      />

                      <GradientButton 
                        onClick={() => runAiAction('summarize', summarizeText)} 
                        loading={aiLoading}
                        variant="primary"
                        className="w-full py-3 text-xs font-bold"
                      >
                        Analyze & Summarize
                      </GradientButton>
                    </div>

                    <div className="p-4 rounded-xl bg-[#050816]/40 border border-white/5 text-xs leading-relaxed whitespace-pre-wrap text-gray-300">
                      {aiMessages.filter(m => m.text.includes("Result for Vault AI SUMMARIZE")).slice(-1)[0]?.text || "No summary formulated yet."}
                    </div>
                  </div>
                )}

                {/* GENERATE AI QUIZ */}
                {aiMode === 'quiz' && (
                  <div className="p-6 overflow-y-auto h-full space-y-4 flex flex-col justify-between">
                    {!generatedQuiz ? (
                      <div className="space-y-4 my-auto max-w-md mx-auto text-center">
                        <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                          <HelpCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Interactive MCQ AI Quiz Maker</h4>
                          <p className="text-xs text-gray-400 mt-1">
                            Vault AI will generate a fresh, unique 3-question MCQ quiz based on your input subject, complete with dynamic solutions.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <input 
                            type="text"
                            placeholder="e.g. Operating Systems, Thermodynamics, Electric Circuits"
                            value={quizSubject}
                            onChange={(e) => setQuizSubject(e.target.value)}
                            className="w-full bg-[#050816] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#22D3EE]"
                          />
                          <GradientButton 
                            onClick={() => handleGenerateQuiz(quizSubject)}
                            loading={aiLoading}
                            variant="premium"
                            className="w-full text-xs font-bold py-2.5"
                          >
                            Generate Dynamic Quiz
                          </GradientButton>
                        </div>
                      </div>
                    ) : (
                      // Quiz Active / Taking Mode
                      <div className="space-y-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center bg-[#050816]/60 border border-white/5 p-3 rounded-xl mb-4">
                            <span className="text-xs font-bold text-amber-400">{generatedQuiz.title}</span>
                            <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                              Question {currentQuestionIndex + 1} of {generatedQuiz.questions.length}
                            </span>
                          </div>

                          {!quizFinished ? (
                            // Showing Current Question
                            <div className="space-y-4">
                              <h5 className="text-sm font-bold text-white leading-relaxed">
                                {generatedQuiz.questions[currentQuestionIndex].questionText}
                              </h5>

                              <div className="space-y-2.5">
                                {generatedQuiz.questions[currentQuestionIndex].options.map((option, oIdx) => {
                                  const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
                                  return (
                                    <button
                                      key={oIdx}
                                      onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: oIdx })}
                                      className={`w-full text-left p-3 rounded-xl text-xs border transition-all ${
                                        isSelected 
                                          ? 'bg-blue-600/20 border-[#22D3EE] text-white font-semibold' 
                                          : 'bg-[#050816]/40 hover:bg-[#050816]/60 border-white/5 text-gray-300'
                                      }`}
                                    >
                                      <span className="inline-block w-5 h-5 rounded-full bg-white/5 text-center leading-5 mr-2 text-[10px] font-bold">
                                        {String.fromCharCode(65 + oIdx)}
                                      </span>
                                      {option}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            // Quiz Summary / Solution Explanation
                            <div className="space-y-4 overflow-y-auto max-h-[380px] pr-1">
                              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-1">
                                <span className="text-xl font-extrabold text-[#10B981]">Quiz Completed!</span>
                                <p className="text-xs text-gray-400">
                                  You scored <strong>{
                                    generatedQuiz.questions.filter((q, idx) => selectedAnswers[idx] === q.correctAnswerIndex).length
                                  } out of {generatedQuiz.questions.length}</strong> correct answers.
                                </p>
                              </div>

                              <div className="space-y-4 divide-y divide-white/5 pt-2">
                                {generatedQuiz.questions.map((q, idx) => {
                                  const yourAns = selectedAnswers[idx];
                                  const isCorrect = yourAns === q.correctAnswerIndex;
                                  return (
                                    <div key={idx} className="space-y-2 pt-3 first:pt-0">
                                      <h6 className="text-xs font-bold text-white flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${isCorrect ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                        Q{idx + 1}: {q.questionText}
                                      </h6>
                                      <div className="text-[11px] space-y-1 pl-4">
                                        <p className="text-gray-400">Your Answer: <strong className={isCorrect ? 'text-[#10B981]' : 'text-red-400'}>
                                          {q.options[yourAns] || 'Not answered'}
                                        </strong></p>
                                        <p className="text-gray-400">Correct Answer: <strong className="text-emerald-400">{q.options[q.correctAnswerIndex]}</strong></p>
                                        <div className="p-2.5 rounded-lg bg-[#050816]/80 border border-white/5 text-gray-400 mt-2">
                                          <span className="font-bold text-[10px] uppercase tracking-wide text-[#22D3EE] block mb-1">Explanation</span>
                                          {q.explanation}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Navigation buttons */}
                        <div className="flex gap-2 pt-4 border-t border-white/5 justify-between">
                          {!quizFinished ? (
                            <>
                              <button
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs disabled:opacity-30"
                              >
                                Previous
                              </button>

                              {currentQuestionIndex < generatedQuiz.questions.length - 1 ? (
                                <button
                                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs disabled:opacity-50"
                                >
                                  Next Question
                                </button>
                              ) : (
                                <button
                                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                                  onClick={() => setQuizFinished(true)}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs disabled:opacity-50"
                                >
                                  Finish Quiz
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setGeneratedQuiz(null);
                                setQuizSubject('');
                              }}
                              className="w-full py-2.5 bg-[#162544] hover:bg-[#162544]/80 text-[#22D3EE] border border-white/10 font-bold rounded-xl text-xs text-center"
                            >
                              Take Another Quiz
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* SIMULATED DOWNLOADS / OFFLINE VIEW */}
          {activeTab === 'downloads' && (
            <motion.div
              key="downloads"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <SectionTitle title="Simulated Offline Downloads" subtitle="Access previously downloaded study assets, offline notes, and slide decks" />

              {downloadedIds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources
                    .filter(res => downloadedIds.includes(res.documentId))
                    .map((res) => (
                      <ResourceCard 
                        key={res.documentId} 
                        resource={res} 
                        isBookmarked={bookmarks.includes(res.documentId)}
                        onBookmark={() => toggleBookmark(res.documentId)}
                        onDownload={() => handleDownloadResource(res)}
                        onView={() => handleViewResource(res)}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-[#162544]/20 rounded-2xl border border-white/5 space-y-3">
                  <FileDown className="w-12 h-12 text-gray-600 mx-auto" />
                  <h3 className="text-base font-bold">No offline resources downloaded yet</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                    Click the download icon on any study materials or lecture papers to store them offline. Premium notes require premium tier.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* PROFILE MANAGEMENT */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <SectionTitle title="Student Profile" subtitle="Manage your educational metadata and premium subscriptions" />

              <GlassCard hoverEffect={false} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600/10 border-2 border-[#22D3EE] text-[#22D3EE] flex items-center justify-center font-extrabold text-2xl shadow-inner">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {user.name} 
                      {user.subscription === 'Premium' && <PremiumBadge />}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-white/5 py-5 text-xs">
                  <div className="space-y-1.5">
                    <span className="text-gray-500 font-medium block">Branch / Semester</span>
                    <span className="text-gray-200 font-semibold">{user.branch} • {user.semester}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-gray-500 font-medium block">Associated College</span>
                    <span className="text-gray-200 font-semibold">{user.college || 'Government Polytechnic, Pune'}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-gray-500 font-medium block">Phone Number</span>
                    <span className="text-gray-200 font-semibold">{user.phone || '+91 98765 43210'}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-gray-500 font-medium block">Registered Date</span>
                    <span className="text-gray-200 font-semibold">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex gap-4 text-xs">
                    <span className="text-gray-400">Bookmarks: <strong>{bookmarks.length}</strong></span>
                    <span className="text-gray-400">Downloaded: <strong>{downloadedIds.length}</strong></span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={onLogout} 
                      className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout Session
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* SAVED BOOKMARKS LIST */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                  <BookMarked className="w-4 h-4 text-[#22D3EE]" /> Saved Notes & Bookmarks
                </h4>
                {bookmarks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources
                      .filter(res => bookmarks.includes(res.documentId))
                      .map(res => (
                        <div key={res.documentId} className="p-3.5 rounded-xl bg-[#162544]/60 border border-white/5 flex justify-between items-center gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-gray-500 uppercase font-semibold">{res.type}</span>
                            <span className="text-xs font-bold text-white block truncate max-w-[200px]">{res.title}</span>
                          </div>
                          <button 
                            onClick={() => handleViewResource(res)} 
                            className="text-[11px] font-bold text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/20 px-2.5 py-1 rounded"
                          >
                            Open
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-[#162544]/20 border border-white/5 rounded-xl text-xs text-gray-500">
                    Your bookmarked folder is empty. Check study sheets and bookmark them for quick access!
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* BOTTOM NAVIGATION FOR STUDENT */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#162544]/95 backdrop-blur-lg border-t border-white/10 py-2.5 px-4 md:px-8 flex justify-around max-w-xl mx-auto md:bottom-4 md:rounded-2xl md:shadow-2xl md:border">
        {[
          { tab: 'home', label: 'Home', icon: Compass },
          { tab: 'search', label: 'Vaults', icon: Search },
          { tab: 'ai', label: 'Vault AI', icon: Brain },
          { tab: 'downloads', label: 'Downloads', icon: FileDown },
          { tab: 'profile', label: 'Profile', icon: User }
        ].map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab as any)}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                isActive ? 'text-[#22D3EE]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 1. PREMIUM UPGRADE MODAL */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-50 bg-[#050816]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#162544] border border-white/10 rounded-[24px] max-w-md w-full p-6 relative shadow-2xl overflow-hidden"
            >
              {/* Premium Glow effect */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <button 
                onClick={() => setShowPremiumModal(false)}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <Sparkles className="w-6 h-6 fill-amber-400" />
                </div>

                <h3 className="text-xl font-bold text-white">Upgrade to CampusVault Premium</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Gain instant access to Premium Handwritten Notes, solved question papers, video modules, offline access, and unlimited smart tutor advice.
                </p>

                <div className="p-4 rounded-xl bg-[#050816]/60 border border-white/5 space-y-3 text-xs text-left">
                  {[
                    'Instant access to all Premium Study Material',
                    'Store unlimited Notes & PDFs in Offline Local Vault',
                    'Interactive quiz preparation and syllabus explanations',
                    'Unlimited career roadmaps generated by Vault AI',
                    'Verified Premium User Profile badge'
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                  <GradientButton onClick={handleUpgradeToPremium} variant="premium" className="w-full py-3 text-xs font-bold uppercase tracking-wider">
                    Unlock Premium (₹299/Semester)
                  </GradientButton>
                  <button 
                    onClick={() => setShowPremiumModal(false)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    No thanks, I will browse free tier
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. RESOURCE DETAIL VIEWER MODAL */}
      <AnimatePresence>
        {viewingResource && (
          <div className="fixed inset-0 z-50 bg-[#050816]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#162544] border border-white/10 rounded-[24px] max-w-lg w-full overflow-hidden shadow-2xl relative"
            >
              <div className="p-5 border-b border-white/5 flex justify-between items-center">
                <span className="text-[10px] text-[#22D3EE] font-bold uppercase tracking-widest">{viewingResource.type}</span>
                <button 
                  onClick={() => setViewingResource(null)}
                  className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* simulated PDF viewer style layout */}
              <div className="p-6 space-y-4">
                <div className="aspect-video w-full rounded-xl bg-[#050816] border border-white/5 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url(${viewingResource.thumbnail})` }} />
                  <div className="relative z-10 space-y-2">
                    <FileText className="w-12 h-12 text-[#22D3EE] mx-auto animate-pulse" />
                    <span className="text-xs text-gray-400 font-medium block">{viewingResource.fileName}</span>
                    <span className="text-[10px] text-gray-500 block">PDF Reader Version 3.5 • SECURE VAULT</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{viewingResource.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{viewingResource.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 text-xs text-gray-400">
                  <div>
                    <span>Subject:</span> <strong className="text-gray-200 block">{viewingResource.subject}</strong>
                  </div>
                  <div>
                    <span>Uploaded By:</span> <strong className="text-gray-200 block">{viewingResource.uploadedBy}</strong>
                  </div>
                  <div>
                    <span>Branch / Term:</span> <strong className="text-gray-200 block">{viewingResource.branch} • {viewingResource.semester}</strong>
                  </div>
                  <div>
                    <span>Statistics:</span> <strong className="text-gray-200 block">{viewingResource.downloads} Downloads • {viewingResource.views} Views</strong>
                  </div>
                </div>

                {/* Simulated content block */}
                <div className="bg-[#050816]/60 border border-white/5 rounded-xl p-4 max-h-[150px] overflow-y-auto">
                  <span className="text-[10px] uppercase font-bold text-[#22D3EE] block mb-1">Interactive Summary Preview</span>
                  <p className="text-[11px] text-gray-400 leading-relaxed italic">
                    "This document focuses on providing standard syllabus coverage for university exams. It includes conceptual breakdowns, schematic block diagrams, formulas, and mock questions solved in detail..."
                  </p>
                </div>

                <div className="flex gap-3">
                  <GradientButton 
                    onClick={() => {
                      alert('Simulated download of ' + viewingResource.fileName + ' initialized successfully.');
                      handleDownloadResource(viewingResource);
                      setViewingResource(null);
                    }}
                    variant="primary"
                    className="flex-1 py-2.5 text-xs font-bold"
                    icon={<Download className="w-4 h-4" />}
                  >
                    Simulate Download PDF
                  </GradientButton>
                  <GradientButton 
                    onClick={() => {
                      // Redirect to chat with preset prompt to explain this notes topic
                      setActiveTab('ai');
                      setAiMode('explain');
                      setExplainTopic(viewingResource.subject);
                      setViewingResource(null);
                    }}
                    variant="secondary"
                    className="py-2.5 text-xs font-bold"
                    icon={<Brain className="w-4 h-4 text-[#22D3EE]" />}
                  >
                    AI Explain This
                  </GradientButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. NOTIFICATION DETAIL MODAL */}
      <AnimatePresence>
        {activeNotification && (
          <div className="fixed inset-0 z-50 bg-[#050816]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#162544] border border-white/10 rounded-[24px] max-w-sm w-full p-6 relative shadow-2xl"
            >
              <button 
                onClick={() => setActiveNotification(null)}
                className="absolute right-4 top-4 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 text-[#22D3EE] rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <Bell className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{activeNotification.title}</h3>
                  <span className="text-[10px] text-gray-500 block mt-0.5">{new Date(activeNotification.createdAt).toLocaleString()}</span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed bg-[#050816]/40 p-4 rounded-xl border border-white/5">
                  {activeNotification.description}
                </p>

                <GradientButton 
                  onClick={() => {
                    setActiveNotification(null);
                    setActiveTab('search');
                  }} 
                  variant="primary" 
                  className="w-full py-2.5 text-xs"
                >
                  Explore Material
                </GradientButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

/* COMPONENT FOR RESOURCE CARDS */
interface ResourceCardProps {
  resource: ResourceItem;
  isBookmarked: boolean;
  onBookmark: () => void;
  onDownload: () => void;
  onView: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isBookmarked,
  onBookmark,
  onDownload,
  onView
}) => {
  return (
    <div className="bg-[#162544]/80 backdrop-blur-md border border-white/10 rounded-[20px] p-5 shadow-xl relative overflow-hidden flex flex-col justify-between h-[360px] group hover:border-[#22D3EE]/30 transition-all duration-200">
      
      {/* CARD TOP */}
      <div className="space-y-3">
        <div className="relative aspect-video rounded-xl bg-[#050816] overflow-hidden border border-white/5 group-hover:border-white/10 transition-colors">
          <img 
            src={resource.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400'} 
            alt={resource.title} 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
          />

          {/* BADGES LAYER */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
            <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
              resource.type === 'PDF' ? 'bg-blue-600 text-white' :
              resource.type === 'PPT' ? 'bg-cyan-600 text-white' :
              resource.type === 'Video' ? 'bg-red-600 text-white' :
              resource.type === 'Assignment' ? 'bg-orange-600 text-white' :
              'bg-purple-600 text-white'
            }`}>
              {resource.type}
            </span>

            {resource.premium && <PremiumBadge className="shadow-lg" />}
          </div>

          <button 
            onClick={onBookmark}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#050816]/75 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#22D3EE] hover:scale-105 transition-all cursor-pointer"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#22D3EE] text-[#22D3EE]' : ''}`} />
          </button>

          {resource.type === 'Video' && (
            <button 
              onClick={onView}
              className="absolute inset-0 m-auto w-10 h-10 bg-[#22D3EE] text-[#050816] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
            >
              <Play className="w-5 h-5 fill-[#050816] ml-0.5" />
            </button>
          )}
        </div>

        <div>
          <span className="text-[10px] text-[#22D3EE] font-bold block mb-0.5">{resource.subject}</span>
          <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#22D3EE] transition-colors">{resource.title}</h4>
          <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">{resource.description}</p>
        </div>
      </div>

      {/* CARD BOTTOM */}
      <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between">
        <div className="text-[10px] text-gray-500">
          <span className="block">By: <strong className="text-gray-300">{resource.uploadedBy}</strong></span>
          <span className="block">{resource.branch} • {resource.semester}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={onDownload}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-[#22D3EE]/20 hover:text-[#22D3EE] border border-white/10 flex items-center justify-center text-gray-400 transition-colors cursor-pointer"
            title="Download simulated material"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button 
            onClick={onView}
            className="px-3 py-1.5 bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#22D3EE] border border-[#2563EB]/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
};
