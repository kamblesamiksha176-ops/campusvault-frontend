import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', id, hoverEffect = true }) => {
  return (
    <motion.div
      id={id}
      className={`bg-[#162544]/80 backdrop-blur-md border border-white/10 rounded-[20px] p-6 shadow-xl relative overflow-hidden ${className}`}
      whileHover={hoverEffect ? { y: -4, borderColor: 'rgba(34, 211, 238, 0.3)' } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'premium' | 'success' | 'danger';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:shadow-[#2563EB]/25 text-white border border-[#2563EB]/20';
      case 'accent':
        return 'bg-gradient-to-r from-[#22D3EE] to-[#0891B2] hover:shadow-[#22D3EE]/25 text-[#050816] font-semibold';
      case 'premium':
        return 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:shadow-[#F59E0B]/25 text-[#050816] font-semibold';
      case 'success':
        return 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:shadow-[#10B981]/25 text-white';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-red-800 hover:shadow-red-600/25 text-white';
      case 'secondary':
      default:
        return 'bg-white/5 hover:bg-white/10 text-white border border-white/10';
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${getVariantStyles()} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {children}
          {icon && <span className="transition-transform group-hover:translate-x-1">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

export const PremiumBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#050816] text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full shadow-md ${className}`}>
      <Sparkles className="w-2.5 h-2.5 fill-[#050816]" />
      Premium
    </span>
  );
};

export const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
        <span className="w-1.5 h-6 bg-[#22D3EE] rounded-full inline-block"></span>
        {title}
      </h2>
      {subtitle && <p className="text-xs md:text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
};
