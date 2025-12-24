import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AlertCard({ alert, onClick, delay = 0 }) {
  const severityConfig = {
    critical: {
      icon: AlertTriangle,
      bg: "from-red-500/20 to-red-600/5",
      border: "border-red-500/40",
      badge: "bg-red-500/20 text-red-300 border-red-500/30",
      iconColor: "text-red-400"
    },
    warning: {
      icon: AlertCircle,
      bg: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/40",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      iconColor: "text-amber-400"
    },
    info: {
      icon: Info,
      bg: "from-cyan-500/20 to-cyan-600/5",
      border: "border-cyan-500/40",
      badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      iconColor: "text-cyan-400"
    }
  };

  const config = severityConfig[alert.severity] || severityConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${config.bg} border ${config.border} p-4 cursor-pointer hover:scale-[1.02] transition-transform`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-white/5 ${config.iconColor}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-medium truncate">{alert.title}</span>
            <Badge variant="outline" className={config.badge}>
              {alert.severity}
            </Badge>
          </div>
          <p className="text-sm text-slate-400 line-clamp-1">{alert.description}</p>
          {alert.time_to_failure_days && (
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
              <Clock size={12} />
              <span>Est. {alert.time_to_failure_days} days to failure</span>
              <span className="text-slate-600">•</span>
              <span>{alert.confidence}% confidence</span>
            </div>
          )}
        </div>
        <ChevronRight size={18} className="text-slate-500 flex-shrink-0" />
      </div>
    </motion.div>
  );
}