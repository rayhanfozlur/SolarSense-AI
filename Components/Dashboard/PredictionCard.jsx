import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Sun, Battery, Cable, Gauge } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function PredictionCard({ prediction, delay = 0 }) {
  const componentIcons = {
    inverter: Cpu,
    panel: Sun,
    battery: Battery,
    sensor: Gauge,
    wiring: Cable
  };

  const Icon = componentIcons[prediction.component_type] || Cpu;

  const getProbabilityColor = (prob) => {
    if (prob >= 70) return 'bg-red-500';
    if (prob >= 40) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getProbabilityTextColor = (prob) => {
    if (prob >= 70) return 'text-red-400';
    if (prob >= 40) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-slate-700/50 text-cyan-400">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium capitalize">{prediction.component_type}</h4>
          <p className="text-xs text-slate-400 capitalize">{prediction.prediction_type.replace('_', ' ')}</p>
        </div>
        <span className={`text-xl font-bold ${getProbabilityTextColor(prediction.probability)}`}>
          {prediction.probability}%
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Failure Probability</span>
          <span>{prediction.probability}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prediction.probability}%` }}
            transition={{ delay: delay + 0.3, duration: 0.8 }}
            className={`h-full ${getProbabilityColor(prediction.probability)} rounded-full`}
          />
        </div>
      </div>

      {prediction.remaining_useful_life_days && (
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-sm">
          <span className="text-slate-400">Est. Life Remaining</span>
          <span className="text-white font-medium">{prediction.remaining_useful_life_days} days</span>
        </div>
      )}

      {prediction.confidence && (
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">AI Confidence</span>
          <span className="text-cyan-400">{prediction.confidence}%</span>
        </div>
      )}
    </motion.div>
  );
}