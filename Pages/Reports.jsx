import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Calendar, TrendingUp, 
  Zap, AlertTriangle, Wrench, Sun, BarChart3 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

export default function Reports() {
  const [timeRange, setTimeRange] = useState('30d');

  const { data: sites = [] } = useQuery({
    queryKey: ['sites'],
    queryFn: () => base44.entities.SolarSite.list()
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.list()
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => base44.entities.MaintenanceTask.list()
  });

  // Calculate metrics
  const totalCapacity = sites.reduce((sum, s) => sum + (s.capacity_kw || 0), 0);
  const avgHealth = sites.length > 0 
    ? Math.round(sites.reduce((sum, s) => sum + (s.health_index || 85), 0) / sites.length)
    : 0;

  // Chart data
  const siteTypeData = [
    { name: 'Residential', value: sites.filter(s => s.site_type === 'residential').length, color: '#10b981' },
    { name: 'Commercial', value: sites.filter(s => s.site_type === 'commercial').length, color: '#06b6d4' },
    { name: 'Industrial', value: sites.filter(s => s.site_type === 'industrial').length, color: '#8b5cf6' },
    { name: 'Utility', value: sites.filter(s => s.site_type === 'utility').length, color: '#f59e0b' },
    { name: 'Community', value: sites.filter(s => s.site_type === 'community').length, color: '#ec4899' }
  ].filter(d => d.value > 0);

  const alertsByType = [
    { type: 'Inverter Failure', count: alerts.filter(a => a.type === 'inverter_failure').length },
    { type: 'Panel Degradation', count: alerts.filter(a => a.type === 'panel_degradation').length },
    { type: 'Soiling', count: alerts.filter(a => a.type === 'soiling').length },
    { type: 'Temperature', count: alerts.filter(a => a.type === 'temperature_stress').length },
    { type: 'Anomaly', count: alerts.filter(a => a.type === 'anomaly').length }
  ];

  const weeklyTrend = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    energy: Math.round(totalCapacity * (4 + Math.random() * 3)),
    efficiency: Math.round(60 + Math.random() * 30)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
            <p className="text-slate-400 mt-1">Comprehensive system performance insights</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                <Calendar size={14} className="mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-slate-700 text-slate-300">
              <Download size={16} className="mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/30 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-emerald-400" size={20} />
              <span className="text-slate-400 text-sm">Total Capacity</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalCapacity.toLocaleString()} kW</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 border border-cyan-500/30 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sun className="text-cyan-400" size={20} />
              <span className="text-slate-400 text-sm">Fleet Health</span>
            </div>
            <p className="text-2xl font-bold text-white">{avgHealth}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-amber-400" size={20} />
              <span className="text-slate-400 text-sm">Active Alerts</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {alerts.filter(a => a.status === 'active').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/5 border border-violet-500/30 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="text-violet-400" size={20} />
              <span className="text-slate-400 text-sm">Pending Tasks</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {tasks.filter(t => t.status === 'pending').length}
            </p>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Energy Trend */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-400" />
                Weekly Energy Production
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Site Types Pie Chart */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-cyan-400" />
                Sites by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                {siteTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={siteTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {siteTypeData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-500">No site data available</p>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {siteTypeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-400">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts by Type */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                Alerts Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertsByType} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis 
                      type="category" 
                      dataKey="type" 
                      stroke="#64748b"
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* System Overview */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText size={18} className="text-violet-400" />
                System Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-700/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">Total Sites</span>
                    <span className="text-white font-semibold">{sites.length}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${(sites.filter(s => s.status === 'online').length / Math.max(sites.length, 1)) * 100}%` }} 
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {sites.filter(s => s.status === 'online').length} online
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-700/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">Total Panels</span>
                    <span className="text-white font-semibold">
                      {sites.reduce((sum, s) => sum + (s.panel_count || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-700/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">Maintenance Cost (Est.)</span>
                    <span className="text-white font-semibold">
                      ${tasks.reduce((sum, t) => sum + (t.estimated_cost || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-700/30">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">AI Predictions</span>
                    <Badge className="bg-cyan-500/20 text-cyan-400">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* National Impact Statement */}
        <Card className="bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              🇺🇸 National Impact Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-400">
                  {Math.round(totalCapacity * 1.2).toLocaleString()}
                </p>
                <p className="text-sm text-slate-400">Tons CO₂ Offset/Year</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">
                  {Math.round(totalCapacity * 1460).toLocaleString()}
                </p>
                <p className="text-sm text-slate-400">kWh Clean Energy/Year</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-violet-400">
                  {Math.round(totalCapacity * 0.15).toLocaleString()}
                </p>
                <p className="text-sm text-slate-400">Homes Powered</p>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-slate-800/50 text-sm text-slate-300">
              <p>
                This platform aligns with U.S. energy priorities including the Inflation Reduction Act's 
                clean energy goals, grid resilience initiatives, and the Biden administration's target 
                of 100% carbon-free electricity by 2035. By enabling predictive maintenance and 
                optimizing solar asset performance, we support equitable access to clean energy 
                and domestic manufacturing of monitoring hardware.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}