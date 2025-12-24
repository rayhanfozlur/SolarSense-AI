import React from 'react';
import { Zap, Battery, Thermometer, Sun, TrendingUp, Droplets } from 'lucide-react';

export default function LiveMetricsGrid({ metrics }) {
  const cards = [
    {
      title: 'Power Output',
      value: `${metrics?.power_output || 0}`,
      unit: 'kW',
      icon: Zap,
      color: 'from-yellow-500 to-amber-400',
      bgGlow: 'from-yellow-500/10 to-amber-500/10',
      change: '+12.5%'
    },
    {
      title: 'Energy Yield',
      value: `${metrics?.energy_yield || 0}`,
      unit: 'kWh',
      icon: Battery,
      color: 'from-cyan-500 to-blue-400',
      bgGlow: 'from-cyan-500/10 to-blue-500/10',
      change: '+8.3%'
    },
    {
      title: 'Panel Temperature',
      value: `${metrics?.temperature || 0}`,
      unit: '°C',
      icon: Thermometer,
      color: 'from-orange-500 to-red-400',
      bgGlow: 'from-orange-500/10 to-red-500/10',
      change: '-2.1%'
    },
    {
      title: 'Solar Irradiance',
      value: `${metrics?.irradiance || 0}`,
      unit: 'W/m²',
      icon: Sun,
      color: 'from-amber-500 to-yellow-400',
      bgGlow: 'from-amber-500/10 to-yellow-500/10',
      change: '+15.7%'
    },
    {
      title: 'Efficiency',
      value: `${metrics?.efficiency || 0}`,
      unit: '%',
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-400',
      bgGlow: 'from-emerald-500/10 to-green-500/10',
      change: '+3.2%'
    },
    {
      title: 'Soiling Loss',
      value: `${metrics?.soiling || 0}`,
      unit: '%',
      icon: Droplets,
      color: 'from-slate-500 to-slate-400',
      bgGlow: 'from-slate-500/10 to-slate-500/10',
      change: '+0.8%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                  {card.change}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-400 mb-2">{card.title}</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white">{card.value}</span>
                  <span className="text-xl font-medium text-slate-500 mb-1">{card.unit}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}