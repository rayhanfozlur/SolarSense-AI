import React from 'react';
import { AlertTriangle, AlertCircle, Info, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { format } from 'date-fns';

export default function AlertsPanel({ alerts }) {
  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return AlertTriangle;
      case 'warning':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getAlertStyle = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'from-red-500/10 to-orange-500/10',
          border: 'border-red-500/30',
          icon: 'text-red-400',
          glow: 'shadow-red-500/10'
        };
      case 'warning':
        return {
          bg: 'from-amber-500/10 to-yellow-500/10',
          border: 'border-amber-500/30',
          icon: 'text-amber-400',
          glow: 'shadow-amber-500/10'
        };
      default:
        return {
          bg: 'from-cyan-500/10 to-blue-500/10',
          border: 'border-cyan-500/30',
          icon: 'text-cyan-400',
          glow: 'shadow-cyan-500/10'
        };
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Active Alerts</h3>
            <p className="text-sm text-slate-400">Real-time system notifications</p>
          </div>
          <Link 
            to={createPageUrl('Alerts')}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 transition-all duration-200 text-sm font-semibold"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
        {alerts && alerts.length > 0 ? (
          alerts.slice(0, 5).map((alert) => {
            const Icon = getAlertIcon(alert.severity);
            const style = getAlertStyle(alert.severity);
            
            return (
              <div
                key={alert.id}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${style.bg} border ${style.border} p-4 hover:scale-[1.02] transition-all duration-200 ${style.glow} shadow-lg`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-slate-900/50 flex items-center justify-center shrink-0 ${style.icon}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${style.icon} bg-slate-900/50`}>
                        {alert.severity}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time_to_failure_days && `${alert.time_to_failure_days} days`}
                      </span>
                      <span className="text-slate-500">{alert.site_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-slate-400 font-medium">No active alerts</p>
            <p className="text-sm text-slate-500 mt-1">All systems operating normally</p>
          </div>
        )}
      </div>
    </div>
  );
}