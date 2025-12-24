import React from 'react';
import { Flame, Droplets, Cloud, Sun } from 'lucide-react';

export default function EnergyHeatmap() {
  const lossFactors = [
    {
      name: 'Soiling Loss',
      value: 4.2,
      icon: Droplets,
      color: 'from-blue-500 to-cyan-400',
      impact: 'moderate'
    },
    {
      name: 'Temperature Stress',
      value: 7.8,
      icon: Flame,
      color: 'from-orange-500 to-red-400',
      impact: 'high'
    },
    {
      name: 'Shading',
      value: 2.1,
      icon: Cloud,
      color: 'from-slate-500 to-slate-400',
      impact: 'low'
    },
    {
      name: 'Panel Degradation',
      value: 5.5,
      icon: Sun,
      color: 'from-amber-500 to-yellow-400',
      impact: 'moderate'
    }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'moderate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 shadow-2xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Energy Loss Analysis</h3>
        <p className="text-sm text-slate-400">Efficiency impact visualization</p>
      </div>

      <div className="space-y-4">
        {lossFactors.map((factor, index) => {
          const Icon = factor.icon;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${factor.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{factor.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(factor.impact)}`}>
                      {factor.impact} impact
                    </span>
                  </div>
                </div>
                <span className="text-xl font-black text-white">{factor.value}%</span>
              </div>
              
              <div className="relative h-3 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className={`h-full bg-gradient-to-r ${factor.color} rounded-full transition-all duration-1000 shadow-lg`}
                  style={{ width: `${(factor.value / 10) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Total Energy Loss</p>
            <p className="text-xs text-slate-500 mt-1">Last 30 days average</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              19.6%
            </p>
            <p className="text-xs text-slate-500">vs 21.2% prev. month</p>
          </div>
        </div>
      </div>
    </div>
  );
}