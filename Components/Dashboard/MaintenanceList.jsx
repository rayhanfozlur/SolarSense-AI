import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, User, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function MaintenanceList({ tasks = [], onTaskClick }) {
  const priorityConfig = {
    urgent: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
    high: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
    medium: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
    low: { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30" }
  };

  const taskTypeIcons = {
    cleaning: "🧹",
    inspection: "🔍",
    repair: "🔧",
    replacement: "🔄",
    calibration: "⚙️"
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Scheduled Maintenance</h3>
        <Badge variant="outline" className="border-slate-600 text-slate-400">
          {tasks.length} tasks
        </Badge>
      </div>

      <div className="space-y-3">
        {tasks.slice(0, 5).map((task, index) => {
          const config = priorityConfig[task.priority] || priorityConfig.medium;
          
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onTaskClick?.(task)}
              className={`p-4 rounded-xl bg-slate-800/50 border ${config.border} cursor-pointer hover:bg-slate-800 transition-colors group`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{taskTypeIcons[task.task_type] || "🔧"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium truncate">{task.title}</span>
                    <Badge className={`${config.bg} ${config.text} border ${config.border}`}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 truncate">{task.site_name}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    {task.scheduled_date && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{format(new Date(task.scheduled_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    {task.assigned_to && (
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{task.assigned_to}</span>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
              </div>
            </motion.div>
          );
        })}

        {tasks.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Wrench size={32} className="mx-auto mb-2 opacity-50" />
            <p>No scheduled maintenance</p>
          </div>
        )}
      </div>
    </div>
  );
}