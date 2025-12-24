import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MetricCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  trendValue,
  color = "emerald",
  delay = 0 
}) {
  const colorClasses = {
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
    cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30",
    amber: "from-amber-500/20 to-amber-600/5 border-amber-500/30",
    red: "from-red-500/20 to-red-600/5 border-red-500/30",
    violet: "from-violet-500/20 to-violet-600/5 border-violet-500/30",
  };

  const iconColors = {
    emerald: "text-emerald-400",
    cyan: "text-cyan-400",
    amber: "text-amber-400",
    red: "text-red-400",
    violet: "text-violet-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-xl p-5`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{value}</span>
            <span className="text-sm text-slate-400">{unit}</span>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
            }`}>
              {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-white/5 ${iconColors[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </motion.div>
  );
}