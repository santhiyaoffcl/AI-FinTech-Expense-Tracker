import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  subtitle?: string;
  variant?: 'emerald' | 'rose' | 'amber' | 'cyan';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  variant = 'emerald',
}) => {
  const variantStyles = {
    emerald: {
      bg: 'bg-slate-900/60 backdrop-blur-xl border-white/10 hover:border-emerald-500/30',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      text: 'text-emerald-400',
    },
    rose: {
      bg: 'bg-slate-900/60 backdrop-blur-xl border-white/10 hover:border-pink-500/30',
      iconBg: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
      text: 'text-pink-400',
    },
    amber: {
      bg: 'bg-slate-900/60 backdrop-blur-xl border-white/10 hover:border-amber-500/30',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      text: 'text-amber-400',
    },
    cyan: {
      bg: 'bg-slate-900/60 backdrop-blur-xl border-white/10 hover:border-purple-500/30',
      iconBg: 'bg-purple-500/15 text-pink-300 border-purple-500/30',
      text: 'text-pink-300',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-200 ${style.bg} shadow-2xl shadow-black/40`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center ${style.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-extrabold tracking-tight text-white">
          ₹{value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        {subtitle && <p className="text-[11px] font-medium text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
};
