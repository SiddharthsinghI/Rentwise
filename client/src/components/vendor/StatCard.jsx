import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subvalue,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'teal'
}) => {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50 text-teal-600 border-teal-100',
      glow: 'shadow-teal-500/10'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      glow: 'shadow-purple-500/10'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      glow: 'shadow-amber-500/10'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      glow: 'shadow-emerald-500/10'
    },
  };

  const currentTheme = colorMap[color] || colorMap.teal;

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft hover:shadow-card transition-all flex flex-col justify-between ${currentTheme.glow}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-sans tracking-tight">
            {value}
          </span>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${currentTheme.bg}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {trend && (
          <span className={`inline-flex items-center gap-1 font-bold ${
            trendPositive ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {trendPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
        {subvalue && (
          <span className="text-slate-400 font-medium">{subvalue}</span>
        )}
      </div>
    </div>
  );
};
