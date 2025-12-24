import React from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

export default function HealthIndexCard({ healthIndex, trend }) {
  const getHealthColor = (index) => {
    if (index >= 90) return 'from-emerald-500 to-green-400';
    if (index >= 75) return 'from-cyan-500 to-blue-400';
    if (index >= 60) return 'from-amber-500 to-yellow-400';
    return 'from-red-500 to-orange-400';
  };

  const getHealthStatus = (index) => {
    if (index >= 90) return 'Excellent';
    if (index >= 75) return 'Good';
    if (index >= 60) return 'Fair';
    return 'Critical';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center border border-cyan-500/30">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">System Health Index</p>
              <p className="text-xs text-slate-500">Real-time diagnostics</p>
            </div>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
              trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-semibold">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-end gap-2 mb-2">
            <span className={`text-7xl font-black bg-gradient-to-r ${getHealthColor(healthIndex)} bg-clip-text text-transparent`}>
              {healthIndex}
            </span>
            <span className="text-3xl font-medium text-slate-500 mb-2">/100</span>
          </div>
          <p className={`text-lg font-semibold bg-gradient-to-r ${getHealthColor(healthIndex)} bg-clip-text text-transparent`}>
            {getHealthStatus(healthIndex)}
          </p>
        </div>

        <div className="relative h-3 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50">
          <div
            className={`h-full bg-gradient-to-r ${getHealthColor(healthIndex)} rounded-full transition-all duration-1000 shadow-lg`}
            style={{ width: `${healthIndex}%` }}
          />
        </div>
      </div>
    </div>
  );
}