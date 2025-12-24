import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, Package, Cpu } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

export default function CostAnalysis() {
  const costBreakdown = [
    { name: "Microcontroller", cost: 12, color: "#10b981" },
    { name: "Sensors", cost: 18, color: "#06b6d4" },
    { name: "Communication", cost: 8, color: "#8b5cf6" },
    { name: "Enclosure", cost: 10, color: "#f59e0b" },
    { name: "PCB & Assembly", cost: 7, color: "#ec4899" },
    { name: "Other", cost: 5, color: "#64748b" }
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Unit Cost Analysis</h3>
        <div className="flex items-center gap-2 text-emerald-400">
          <TrendingDown size={16} />
          <span className="text-sm">Target: $60</span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/30 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center text-3xl font-bold text-white">
                <DollarSign size={24} className="text-emerald-400" />
                {totalCost}
              </div>
              <span className="text-xs text-slate-400">per unit</span>
            </div>
          </div>
          <div className="absolute -right-2 -top-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
            ✓ Under Budget
          </div>
        </motion.div>
      </div>

      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={costBreakdown} layout="vertical">
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
              {costBreakdown.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50">
          <Package size={18} className="text-cyan-400" />
          <div>
            <p className="text-xs text-slate-400">Volume Discount</p>
            <p className="text-sm font-medium text-white">-15% @ 1000+</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50">
          <Cpu size={18} className="text-violet-400" />
          <div>
            <p className="text-xs text-slate-400">Open Source SW</p>
            <p className="text-sm font-medium text-white">$0 License</p>
          </div>
        </div>
      </div>
    </div>
  );
}