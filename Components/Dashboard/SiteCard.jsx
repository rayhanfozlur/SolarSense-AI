import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, ThermometerSun, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SiteCard({ site, onClick, delay = 0 }) {
  const statusConfig = {
    online: { bg: "bg-emerald-500", text: "text-emerald-400", label: "Online" },
    offline: { bg: "bg-red-500", text: "text-red-400", label: "Offline" },
    degraded: { bg: "bg-amber-500", text: "text-amber-400", label: "Degraded" },
    maintenance: { bg: "bg-cyan-500", text: "text-cyan-400", label: "Maintenance" }
  };

  const config = statusConfig[site.status] || statusConfig.online;

  const getHealthColor = (health) => {
    if (health >= 80) return 'text-emerald-400';
    if (health >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-5 cursor-pointer hover:border-slate-600/50 transition-all group"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:from-emerald-500/10 transition-all" />
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{site.name}</h3>
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <MapPin size={14} />
            <span>{site.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.bg} animate-pulse`} />
          <Badge variant="outline" className={`border-slate-600 ${config.text}`}>
            {config.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
            <Zap size={14} />
            <span className="text-xs">Capacity</span>
          </div>
          <span className="text-white font-semibold">{site.capacity_kw} kW</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
            <Activity size={14} />
            <span className="text-xs">Health</span>
          </div>
          <span className={`font-semibold ${getHealthColor(site.health_index)}`}>
            {site.health_index || 0}%
          </span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
            <ThermometerSun size={14} />
            <span className="text-xs">Panels</span>
          </div>
          <span className="text-white font-semibold">{site.panel_count || 0}</span>
        </div>
      </div>
    </motion.div>
  );
}