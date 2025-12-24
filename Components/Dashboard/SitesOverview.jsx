import React from 'react';
import { MapPin, Activity, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function SitesOverview({ sites }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'from-emerald-500 to-green-400';
      case 'degraded':
        return 'from-amber-500 to-yellow-400';
      case 'offline':
        return 'from-red-500 to-orange-400';
      default:
        return 'from-slate-500 to-slate-400';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-emerald-400';
    if (health >= 75) return 'text-cyan-400';
    if (health >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Solar Sites</h3>
            <p className="text-sm text-slate-400">Fleet monitoring overview</p>
          </div>
          <Link 
            to={createPageUrl('Sites')}
            className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 transition-all duration-200 text-sm font-semibold"
          >
            Manage Sites
          </Link>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
        {sites && sites.length > 0 ? (
          sites.map((site) => (
            <div
              key={site.id}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 p-5 hover:border-cyan-500/30 transition-all duration-200 hover:scale-[1.02] group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">{site.name}</h4>
                    <p className="text-sm text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {site.location}
                    </p>
                  </div>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getStatusColor(site.status)} shadow-lg`} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="px-3 py-2 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Capacity</p>
                    <p className="text-sm font-bold text-white">{site.capacity_kw} kW</p>
                  </div>
                  <div className="px-3 py-2 bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Health</p>
                    <p className={`text-sm font-bold ${getHealthColor(site.health_index)}`}>
                      {site.health_index}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{site.panel_count} panels</span>
                  <span className="text-slate-500">{site.inverter_count} inverters</span>
                  <span className="text-slate-400 capitalize">{site.site_type}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No sites configured</p>
            <p className="text-sm text-slate-500 mt-1">Add your first solar site to begin monitoring</p>
          </div>
        )}
      </div>
    </div>
  );
}