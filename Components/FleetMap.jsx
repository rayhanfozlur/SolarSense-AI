import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap } from 'lucide-react';

export default function FleetMap({ sites = [] }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'degraded': return 'bg-amber-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-cyan-500';
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Fleet Overview</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Online</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-400">Degraded</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-400">Offline</span>
          </div>
        </div>
      </div>

      <div className="relative h-64 bg-slate-900/50 rounded-xl overflow-hidden">
        {/* Stylized US Map Background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 800 500" className="w-full h-full">
            <path
              d="M150,150 Q200,100 300,120 T450,100 T600,130 T700,150 Q720,200 710,280 T680,350 T600,380 T450,400 T300,380 T180,350 T150,280 T150,150"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Site Markers */}
        {sites.map((site, index) => {
          const x = 20 + (index % 4) * 20 + Math.random() * 10;
          const y = 20 + Math.floor(index / 4) * 25 + Math.random() * 10;
          
          return (
            <motion.div
              key={site.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className={`w-4 h-4 rounded-full ${getStatusColor(site.status)} animate-pulse`} />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                  <p className="text-white text-sm font-medium">{site.name}</p>
                  <p className="text-slate-400 text-xs">{site.capacity_kw} kW</p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {sites.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <MapPin size={32} className="mx-auto mb-2 opacity-50" />
              <p>No sites configured</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-white">{sites.length}</p>
          <p className="text-xs text-slate-400">Total Sites</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-400">
            {sites.filter(s => s.status === 'online').length}
          </p>
          <p className="text-xs text-slate-400">Online</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">
            {sites.reduce((sum, s) => sum + (s.capacity_kw || 0), 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-400">Total kW</p>
        </div>
      </div>
    </div>
  );
}