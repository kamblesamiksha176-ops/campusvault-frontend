import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  School, 
  ArrowRight, 
  Sparkles,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { INITIAL_USERS } from '../data';
import { GlassCard, GradientButton } from './UIElements';

interface SplashAndAuthProps {
  onAuthComplete: (user: UserProfile) => void;
}

export const SplashAndAuth: React.FC<SplashAndAuthProps> = ({ onAuthComplete }) => {
  const [step, setStep] = useState<'splash' | 'roleSelect' | 'login' | 'register' | 'forgot' | 'verify'>('splash');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('Computer Engineering');
  const [semester, setSemester] = useState('3rd Semester');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempUser, setTempUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('roleSelect');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    // Prefill mock emails for testing ease
    if (role === 'Student') setEmail('student@campusvault.com');
    else if (role === 'Teacher') setEmail('teacher@campusvault.com');
    else if (role === 'Admin') setEmail('admin@campusvault.com');
    setPassword('password');
    setStep('login');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      // Find matching mock user
      const foundUser = INITIAL_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.role === selectedRole
      );

      if (foundUser) {
        // Authenticated! Now do email verification simulation
        setTempUser(foundUser);
        setStep('verify');
      } else {
        // Custom credentials entered, let's create a custom session
        if (email && password) {
          const customUser: UserProfile = {
            uid: `custom-${Date.now()}`,
            name: email.split('@')[0].toUpperCase(),
            email,
            phone: '+91 99999 88888',
            college: 'Modern Engineering Institute',
            branch: 'Computer Engineering',
            semester: '3rd Semester',
            role: selectedRole,
            subscription: selectedRole === 'Admin' ? 'Premium' : 'Free',
            emailVerified: false,
            createdAt: new Date().toISOString(),
          };
          setTempUser(customUser);
          setStep('verify');
        } else {
          setErrorMessage(`Invalid email or password for ${selectedRole} role. Use one of our quick-autofills!`);
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        uid: `user-${Date.now()}`,
        name,
        email,
        phone,
        college,
        branch,
        semester,
        role: 'Student', // Teachers and Admins are predefined or verified
        subscription: 'Free',
        emailVerified: false,
        createdAt: new Date().toISOString(),
      };
      setTempUser(newUser);
      setStep('verify');
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyComplete = () => {
    if (tempUser) {
      const verifiedUser: UserProfile = { ...tempUser, emailVerified: true };
      onAuthComplete(verifiedUser);
    }
  };

  const autofillDemo = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'Student') {
      setEmail('student@campusvault.com');
    } else if (role === 'Teacher') {
      setEmail('teacher@campusvault.com');
    } else if (role === 'Admin') {
      setEmail('admin@campusvault.com');
    }
    setPassword('password');
    setStep('login');
  };

  return (
    <div className="min-h-screen w-full bg-[#050816] text-white flex flex-col items-center justify-center relative px-4 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#22D3EE]/15 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              className="w-24 h-24 bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] rounded-[24px] flex items-center justify-center shadow-lg shadow-[#2563EB]/20 mb-6"
            >
              <GraduationCap className="w-14 h-14 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-[#22D3EE] bg-clip-text text-transparent"
            >
              CAMPUSVAULT
            </motion.h1>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-400 mt-2 tracking-wide font-medium"
            >
              Gramin Study Point • AI Smart Learning
            </motion.p>

            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 140 }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="h-1 bg-gradient-to-r from-[#2563EB] to-[#22D3EE] rounded-full mt-8"
            />
          </motion.div>
        )}

        {step === 'roleSelect' && (
          <motion.div
            key="roleSelect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl text-center z-10"
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-[#162544] border border-white/10 rounded-full flex items-center justify-center mb-3">
                <GraduationCap className="w-8 h-8 text-[#22D3EE]" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Choose Your Role
              </h2>
              <p className="mt-2 text-sm text-gray-400 max-w-md">
                Select your persona to enter CampusVault (Gramin Study Point) educational portal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              {/* Student Role */}
              <GlassCard 
                className="cursor-pointer border-white/5 hover:border-[#22D3EE]/30 group transition-all"
                hoverEffect={true}
              >
                <div onClick={() => handleRoleSelect('Student')} className="h-full flex flex-col items-center text-center p-2">
                  <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-all">
                    <BookOpen className="w-7 h-7 text-[#2563EB]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Student Portal</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Access notes, video lectures, complete interactive quizzes, search previous year papers, and study with Vault AI.
                  </p>
                  <div className="mt-5 text-xs text-[#22D3EE] font-semibold flex items-center gap-1 group-hover:underline">
                    Enter Dashboard <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </GlassCard>

              {/* Teacher Role */}
              <GlassCard 
                className="cursor-pointer border-white/5 hover:border-[#22D3EE]/30 group transition-all"
                hoverEffect={true}
              >
                <div onClick={() => handleRoleSelect('Teacher')} className="h-full flex flex-col items-center text-center p-2">
                  <div className="w-14 h-14 bg-cyan-600/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-cyan-600/20 transition-all">
                    <GraduationCap className="w-7 h-7 text-[#22D3EE]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Teacher Terminal</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Upload notes, slides, question banks, assignments, post notices, and track class resource engagement statistics.
                  </p>
                  <div className="mt-5 text-xs text-[#22D3EE] font-semibold flex items-center gap-1 group-hover:underline">
                    Enter Terminal <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </GlassCard>

              {/* Admin Role */}
              <GlassCard 
                className="cursor-pointer border-white/5 hover:border-[#F59E0B]/30 group transition-all"
                hoverEffect={true}
              >
                <div onClick={() => handleRoleSelect('Admin')} className="h-full flex flex-col items-center text-center p-2">
                  <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-all">
                    <ShieldCheck className="w-7 h-7 text-[#F59E0B]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Admin Command</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Control global user accounts, handle subscriptions, moderate resources, customize Vault AI limits, and view revenue metrics.
                  </p>
                  <div className="mt-5 text-xs text-[#F59E0B] font-semibold flex items-center gap-1 group-hover:underline">
                    Control Console <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Quick Demo Login Help */}
            <div className="mt-6 inline-flex flex-wrap gap-2 items-center justify-center bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5 text-xs max-w-xl mx-auto">
              <span className="text-gray-400 font-medium">Quick Demo Access:</span>
              <button onClick={() => autofillDemo('Student')} className="text-[#22D3EE] font-semibold hover:underline bg-white/5 px-2 py-1 rounded">Student Dashboard</button>
              <span className="text-gray-600">•</span>
              <button onClick={() => autofillDemo('Teacher')} className="text-[#22D3EE] font-semibold hover:underline bg-white/5 px-2 py-1 rounded">Teacher Terminal</button>
              <span className="text-gray-600">•</span>
              <button onClick={() => autofillDemo('Admin')} className="text-[#F59E0B] font-semibold hover:underline bg-white/5 px-2 py-1 rounded">Admin Console</button>
            </div>
          </motion.div>
        )}

        {step === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md z-10"
          >
            <button 
              onClick={() => setStep('roleSelect')} 
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-6 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Role Selection
            </button>

            <GlassCard hoverEffect={false}>
              <div className="mb-6 text-center">
                <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 ${
                  selectedRole === 'Admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  selectedRole === 'Teacher' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {selectedRole} Portal
                </span>
                <h3 className="text-2xl font-bold text-white">Sign In</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedRole === 'Admin' ? 'Pre-defined credentials required' : 'Enter details to enter your learning vault'}
                </p>
              </div>

              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-4 leading-relaxed">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. student@campusvault.com"
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22D3EE] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs text-gray-400 font-medium">Password</label>
                    <button 
                      type="button" 
                      onClick={() => setStep('forgot')}
                      className="text-xs text-[#22D3EE] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22D3EE] transition-colors"
                      required
                    />
                  </div>
                </div>

                <GradientButton 
                  type="submit" 
                  variant={selectedRole === 'Admin' ? 'premium' : 'primary'} 
                  loading={isLoading} 
                  className="w-full mt-2 py-3 rounded-xl"
                >
                  Enter Platform
                </GradientButton>
              </form>

              {selectedRole === 'Student' && (
                <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-gray-400">
                  Don't have a student vault yet?{' '}
                  <button onClick={() => setStep('register')} className="text-[#22D3EE] font-semibold hover:underline">
                    Create an Account
                  </button>
                </div>
              )}

              {/* autofill assist for login screen */}
              <div className="mt-5 p-3 rounded-xl bg-[#050816]/60 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">Simulated Demo Credentials</p>
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between text-gray-400 bg-white/5 p-1.5 rounded">
                    <span>Email: <strong className="text-gray-300">{selectedRole.toLowerCase()}@campusvault.com</strong></span>
                    <span>Pass: <strong className="text-gray-300">password</strong></span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md z-10 my-8"
          >
            <button 
              onClick={() => setStep('login')} 
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-6 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>

            <GlassCard hoverEffect={false}>
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-white">Create Student Account</h3>
                <p className="text-xs text-gray-400 mt-1">Register your profile to enroll in the digital campus</p>
              </div>

              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-4">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Amit Sharma"
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22D3EE] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. amit@gmail.com"
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22D3EE] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22D3EE] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1">College / Institute</label>
                  <div className="relative">
                    <School className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. Government Polytechnic, Pune"
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2 pl-11 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22D3EE] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 font-medium mb-1">Branch</label>
                    <select 
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#22D3EE] transition-colors"
                    >
                      <option>Computer Engineering</option>
                      <option>Electrical Engineering</option>
                      <option>Mechanical Engineering</option>
                      <option>Civil Engineering</option>
                      <option>Electronics & Telecommunication</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 font-medium mb-1">Semester</label>
                    <select 
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-[#22D3EE] transition-colors"
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

                <GradientButton 
                  type="submit" 
                  variant="primary" 
                  loading={isLoading} 
                  className="w-full mt-3 py-2.5 rounded-xl"
                >
                  Sign Up & Verify
                </GradientButton>
              </form>

              <div className="mt-4 pt-4 border-t border-white/5 text-center text-xs text-gray-400">
                Already registered?{' '}
                <button onClick={() => setStep('login')} className="text-[#22D3EE] font-semibold hover:underline">
                  Sign In
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 'forgot' && (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md z-10"
          >
            <GlassCard hoverEffect={false}>
              <div className="mb-6 text-center">
                <h3 className="text-xl font-bold text-white">Reset Password</h3>
                <p className="text-xs text-gray-400 mt-1">We will send a reset password link to your registered email address</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 font-medium mb-1.5">Registered Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="email" 
                      placeholder="e.g. amit@gmail.com"
                      className="w-full bg-[#050816] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#22D3EE] transition-colors"
                    />
                  </div>
                </div>

                <GradientButton 
                  onClick={() => {
                    alert('Password reset link has been dispatched to your email address (simulated)!');
                    setStep('login');
                  }}
                  variant="primary"
                  className="w-full py-2.5 rounded-xl"
                >
                  Send Recovery Link
                </GradientButton>

                <button 
                  onClick={() => setStep('login')}
                  className="w-full text-center text-xs text-[#22D3EE] hover:underline"
                >
                  Back to login
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {step === 'verify' && tempUser && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md z-10"
          >
            <GlassCard hoverEffect={false} className="text-center">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Mail className="w-8 h-8 text-[#10B981]" />
              </div>

              <h3 className="text-2xl font-bold text-white">Email Verification Required</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed px-2">
                A verification link has been simulated for <strong className="text-gray-200">{tempUser.email}</strong>. 
                Please verify to satisfy security checks.
              </p>

              <div className="my-6 p-4 rounded-xl bg-[#050816] border border-white/5 flex flex-col items-center gap-1.5 text-xs text-left">
                <div className="flex items-start gap-2 text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>Validated credentials securely</span>
                </div>
                <div className="flex items-start gap-2 text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>Mapped Firestore user profile role: <strong>{tempUser.role}</strong></span>
                </div>
              </div>

              <GradientButton 
                onClick={handleVerifyComplete}
                variant="success"
                className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Simulate Verification & Proceed
              </GradientButton>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
