import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { 
  Zap, Sun, ThermometerSun, Activity, AlertTriangle, 
  TrendingUp, Battery, Gauge, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import HealthGauge from '@/components/dashboard/HealthGauge';
import MetricCard from '@/components/dashboard/MetricCard';
import AlertCard from '@/components/dashboard/AlertCard';
import SiteCard from '@/components/dashboard/SiteCard';
import EnergyChart from '@/components/dashboard/EnergyChart';
import PredictionCard from '@/components/dashboard/PredictionCard';
import FleetMap from '@/components/dashboard/FleetMap';
import MaintenanceList from '@/components/dashboard/MaintenanceList';
import PerformanceHeatmap from '@/components/dashboard/PerformanceHeatmap';
import SystemArchitecture from '@/components/dashboard/SystemArchitecture';
import CostAnalysis from '@/components/dashboard/CostAnalysis';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: sites = [], isLoading: sitesLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: () => base44.entities.SolarSite.list()
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.filter({ status: 'active' })
  });

  const { data: predictions = [] } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => base44.entities.Prediction.list()
  });

  const { data: maintenanceTasks = [] } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => base44.entities.MaintenanceTask.filter({ status: 'pending' })
  });

  // Generate sample chart data
  const chartData = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const isSunny = hour >= 6 && hour <= 18;
    const baseValue = isSunny ? Math.sin((hour - 6) / 12 * Math.PI) * 85 : 0;
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      power: Math.max(0, baseValue + (Math.random() * 10 - 5))
    };
  });

  // Calculate aggregated metrics
  const totalCapacity = sites.reduce((sum, s) => sum + (s.capacity_kw || 0), 0);
  const avgHealth = sites.length > 0 
    ? Math.round(sites.reduce((sum, s) => sum + (s.health_index || 85), 0) / sites.length)
    : 85;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SolarSense AI</h1>
                <p className="text-xs text-slate-400">Predictive Solar Health Monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-400">System Online</span>
              </div>
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <RefreshCw size={14} className="mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">Overview</TabsTrigger>
            <TabsTrigger value="fleet" className="data-[state=active]:bg-slate-700">Fleet</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">Analytics</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-slate-700">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Total Capacity"
                value={totalCapacity.toLocaleString()}
                unit="kW"
                icon={Zap}
                color="emerald"
                trend="up"
                trendValue="+12% this month"
                delay={0}
              />
              <MetricCard
                title="Current Output"
                value={(totalCapacity * 0.72).toFixed(0)}
                unit="kW"
                icon={Activity}
                color="cyan"
                trend="up"
                trendValue="72% efficiency"
                delay={0.1}
              />
              <MetricCard
                title="Today's Energy"
                value={(totalCapacity * 5.2).toFixed(0)}
                unit="kWh"
                icon={Battery}
                color="violet"
                delay={0.2}
              />
              <MetricCard
                title="Active Alerts"
                value={alerts.length}
                unit={criticalAlerts > 0 ? `(${criticalAlerts} critical)` : ''}
                icon={AlertTriangle}
                color={criticalAlerts > 0 ? 'red' : 'amber'}
                delay={0.3}
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <EnergyChart data={chartData} title="Today's Power Output" />
                
                {/* Alerts Section */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <AlertTriangle size={18} className="text-amber-400" />
                      Active Alerts
                    </h3>
                    <span className="text-xs text-slate-400">{alerts.length} alerts</span>
                  </div>
                  <div className="space-y-3">
                    {alerts.slice(0, 4).map((alert, index) => (
                      <AlertCard key={alert.id} alert={alert} delay={index * 0.1} />
                    ))}
                    {alerts.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Activity size={32} className="mx-auto mb-2 opacity-50" />
                        <p>All systems operating normally</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Health Gauge */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-5">
                  <h3 className="text-lg font-semibold text-white mb-4 text-center">Fleet Health</h3>
                  <HealthGauge value={avgHealth} />
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-slate-400">Sites</p>
                      <p className="text-lg font-bold text-white">{sites.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Online</p>
                      <p className="text-lg font-bold text-emerald-400">
                        {sites.filter(s => s.status === 'online').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Issues</p>
                      <p className="text-lg font-bold text-amber-400">
                        {sites.filter(s => s.status === 'degraded').length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Predictions */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-5">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Gauge size={18} className="text-cyan-400" />
                    AI Predictions
                  </h3>
                  <div className="space-y-3">
                    {predictions.slice(0, 3).map((pred, index) => (
                      <PredictionCard key={pred.id} prediction={pred} delay={index * 0.1} />
                    ))}
                    {predictions.length === 0 && (
                      <div className="text-center py-6 text-slate-500">
                        <p className="text-sm">No predictions available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Fleet Tab */}
          <TabsContent value="fleet" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FleetMap sites={sites} />
              </div>
              <div>
                <MaintenanceList tasks={maintenanceTasks} />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">All Sites</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sites.map((site, index) => (
                  <SiteCard key={site.id} site={site} delay={index * 0.1} />
                ))}
                {sites.length === 0 && (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    <Sun size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No sites configured yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceHeatmap />
              <EnergyChart data={chartData} title="Weekly Trend" />
            </div>
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Predictive Diagnostics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predictions.map((pred, index) => (
                    <PredictionCard key={pred.id} prediction={pred} delay={index * 0.1} />
                  ))}
                  {predictions.length === 0 && (
                    <div className="col-span-full text-center py-8 text-slate-500">
                      <Gauge size={32} className="mx-auto mb-2 opacity-50" />
                      <p>ML predictions will appear here</p>
                    </div>
                  )}
                </div>
              </div>
              <CostAnalysis />
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="mt-6">
            <SystemArchitecture />
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CostAnalysis />
              
              <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">Technical Specifications</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <h4 className="text-sm font-medium text-white mb-2">Hardware</h4>
                    <ul className="space-y-1 text-sm text-slate-400">
                      <li>• ESP32-S3 / ARM Cortex-M4 Controller</li>
                      <li>• Hall-effect Current Sensors (±0.5% accuracy)</li>
                      <li>• PT100 Temperature Sensors</li>
                      <li>• Si1145 Irradiance Sensor</li>
                      <li>• IP67 Weatherproof Enclosure</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <h4 className="text-sm font-medium text-white mb-2">Communication</h4>
                    <ul className="space-y-1 text-sm text-slate-400">
                      <li>• LoRaWAN (10km+ range)</li>
                      <li>• Wi-Fi 802.11 b/g/n</li>
                      <li>• LTE-M / NB-IoT (optional)</li>
                      <li>• MQTT over TLS 1.3</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <h4 className="text-sm font-medium text-white mb-2">Security</h4>
                    <ul className="space-y-1 text-sm text-slate-400">
                      <li>• AES-256 Encryption</li>
                      <li>• Device Authentication (X.509)</li>
                      <li>• Secure Boot & OTA Updates</li>
                      <li>• Role-Based Access Control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}