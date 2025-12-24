import React from 'react';
import { motion } from 'framer-motion';

export default function PerformanceHeatmap({ data = [] }) {
  // Generate sample hourly data for a week if no data provided
  const generateData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return days.map((day, dayIndex) => ({
      day,
      hours: hours.map(hour => {
        // Simulate solar production patterns
        const isSunnyHours = hour >= 6 && hour <= 18;
        const peakHours = hour >= 10 && hour <= 14;
        const baseValue = isSunnyHours ? (peakHours ? 80 : 50) : 5;
        const randomVariation = Math.random() * 20 - 10;
        return Math.max(0, Math.min(100, baseValue + randomVariation));
      })
    }));
  };

  const heatmapData = data.length > 0 ? data : generateData();

  const getColor = (value) => {
    if (value >= 80) return 'bg-emerald-500';
    if (value >= 60) return 'bg-emerald-600';
    if (value >= 40) return 'bg-emerald-700';
    if (value >= 20) return 'bg-emerald-800';
    if (value >= 5) return 'bg-slate-700';
    return 'bg-slate-800';
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Energy Production Heatmap</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-slate-800" />
            <span className="text-xs text-slate-500">Low</span>
          </div>
          <div className="w-16 h-3 rounded bg-gradient-to-r from-slate-700 via-emerald-700 to-emerald-500" />
          <span className="text-xs text-slate-500">High</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="flex mb-1 pl-12">
            {[0, 6, 12, 18, 23].map(hour => (
              <div 
                key={hour} 
                className="text-xs text-slate-500"
                style={{ width: hour === 23 ? 'auto' : `${(hour === 0 ? 6 : 6) / 24 * 100}%`, marginLeft: hour === 0 ? 0 : 'auto' }}
              >
                {hour}:00
              </div>
            ))}
          </div>

          {/* Heatmap rows */}
          {heatmapData.map((row, dayIndex) => (
            <div key={row.day} className="flex items-center gap-1 mb-1">
              <span className="w-10 text-xs text-slate-500 text-right pr-2">{row.day}</span>
              <div className="flex-1 flex gap-0.5">
                {row.hours.map((value, hourIndex) => (
                  <motion.div
                    key={hourIndex}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (dayIndex * 24 + hourIndex) * 0.002 }}
                    className={`flex-1 h-6 rounded-sm ${getColor(value)} cursor-pointer hover:ring-2 hover:ring-white/30 transition-all`}
                    title={`${row.day} ${hourIndex}:00 - ${value.toFixed(0)}% efficiency`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-emerald-400">84%</p>
          <p className="text-xs text-slate-500">Peak Hours Avg</p>
        </div>
        <div>
          <p className="text-lg font-bold text-white">62%</p>
          <p className="text-xs text-slate-500">Daily Avg</p>
        </div>
        <div>
          <p className="text-lg font-bold text-cyan-400">12:30</p>
          <p className="text-xs text-slate-500">Best Hour</p>
        </div>
      </div>
    </div>
  );
}