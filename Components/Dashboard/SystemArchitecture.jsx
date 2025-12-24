import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Cpu, Cloud, Smartphone, Database, Wifi, Shield, ArrowRight } from 'lucide-react';

export default function SystemArchitecture() {
  const layers = [
    {
      title: "Field Layer",
      icon: Sun,
      color: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/30",
      items: ["Solar Panels", "Voltage Sensors", "Current Sensors", "Temp Sensors", "Irradiance Sensors"]
    },
    {
      title: "Edge Layer",
      icon: Cpu,
      color: "from-cyan-500/20 to-cyan-600/5",
      border: "border-cyan-500/30",
      items: ["ESP32/ARM Controller", "Local ML Inference", "Data Buffering", "Anomaly Detection"]
    },
    {
      title: "Communication",
      icon: Wifi,
      color: "from-violet-500/20 to-violet-600/5",
      border: "border-violet-500/30",
      items: ["LoRaWAN", "Wi-Fi/LTE", "MQTT Protocol", "OTA Updates"]
    },
    {
      title: "Cloud Layer",
      icon: Cloud,
      color: "from-emerald-500/20 to-emerald-600/5",
      border: "border-emerald-500/30",
      items: ["Time-Series DB", "ML Analytics", "API Gateway", "Alert Engine"]
    }
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">System Architecture</h3>
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-emerald-400" />
          <span className="text-xs text-slate-400">End-to-End Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {layers.map((layer, index) => (
          <React.Fragment key={layer.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`relative rounded-xl bg-gradient-to-br ${layer.color} border ${layer.border} p-4`}
            >
              <div className="flex items-center gap-2 mb-3">
                <layer.icon size={18} className="text-white" />
                <span className="text-sm font-medium text-white">{layer.title}</span>
              </div>
              <ul className="space-y-1">
                {layer.items.map((item, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-slate-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            {index < layers.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.1 }}
                className="hidden md:flex items-center justify-center absolute"
                style={{ left: `${(index + 1) * 25 - 2}%`, top: '50%' }}
              >
                <ArrowRight size={16} className="text-slate-600" />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-cyan-400" />
            <span className="text-xs text-slate-400">Time-Series Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-violet-400" />
            <span className="text-xs text-slate-400">Edge Computing</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone size={14} className="text-emerald-400" />
            <span className="text-xs text-slate-400">Mobile Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}