import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Brain, Zap, AlertTriangle, Wrench, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');

  const { data: predictions } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => base44.entities.Prediction.list('-created_date', 50),
    initialData: []
  });

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.list('-created_date', 100),
    initialData: []
  });

  const { data: sites } = useQuery({
    queryKey: ['sites'],
    queryFn: () => base44.entities.SolarSite.list(),
    initialData: []
  });

  // Generate mock performance data
  const performanceData = Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    energy: Math.random() * 200 + 800,
    efficiency: Math.random() * 10 + 85,
    temperature: Math.random() * 15 + 35
  }));

  // Component failure predictions
  const componentData = [
    { name: 'Inverters', value: predictions.filter(p => p.component_type === 'inverter').length || 12 },
    { name: 'Panels', value: predictions.filter(p => p.component_type === 'panel').length || 8 },
    { name: 'Sensors', value: predictions.filter(p => p.component_type === 'sensor').length || 5 },
    { name: 'Wiring', value: predictions.filter(p => p.component_type === 'wiring').length || 3 }
  ];

  const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  // Alert severity distribution
  const alertData = [
    { severity: 'Critical', count: alerts.filter(a => a.severity === 'critical').length || 15 },
    { severity: 'Warning', count: alerts.filter(a => a.severity === 'warning').length || 32 },
    { severity: 'Info', count: alerts.filter(a => a.severity === 'info').length || 18 }
  ];

  // Site health distribution
  const siteHealthData = sites.map(site => ({
    name: site.name,
    health: site.health_index || 85,
    capacity: site.capacity_kw || 0
  }));

  // Predictive maintenance timeline
  const maintenanceTimeline = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    predicted: Math.floor(Math.random() * 20) + 10,
    actual: Math.floor(Math.random() * 15) + 5
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl p-4 shadow-2xl">
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
            Predictive Analytics
          </h1>
          <p className="text-slate-400">AI-powered insights and performance metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40 bg-slate-800/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Prediction Accuracy', value: '94.2%', icon: Brain, color: 'from-purple-500 to-pink-400' },
          { label: 'Avg Energy Yield', value: '987 kWh', icon: Zap, color: 'from-cyan-500 to-blue-400' },
          { label: 'Active Predictions', value: predictions.length, icon: TrendingUp, color: 'from-amber-500 to-orange-400' },
          { label: 'Maintenance Events', value: '42', icon: Wrench, color: 'from-emerald-500 to-green-400' }
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-5 rounded-full blur-3xl`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-slate-400 mb-2">{metric.label}</p>
                <p className="text-3xl font-black text-white">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Trends */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Performance Trends</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="energy" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" name="Energy (kWh)" />
            <Area type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEfficiency)" name="Efficiency (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Component Failure Predictions */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Failure Predictions by Component</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={componentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {componentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {componentData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                <span className="text-sm text-slate-300">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Severity Distribution */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Alert Severity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="severity" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]}>
                {alertData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#06b6d4'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Site Health Comparison */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Site Health Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={siteHealthData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="health" fill="#10b981" radius={[0, 8, 8, 0]} name="Health Index" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Timeline */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Predictive vs Actual Maintenance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={maintenanceTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={3} name="AI Predicted" />
              <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Events" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Predictions Table */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Active Failure Predictions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Component</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Probability</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">RUL (Days)</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {predictions.slice(0, 10).map((pred) => (
                <tr key={pred.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="py-4 px-4 text-white font-medium">{pred.component_id || 'Unknown'}</td>
                  <td className="py-4 px-4 text-slate-300 capitalize">{pred.component_type}</td>
                  <td className="py-4 px-4">
                    <span className={`font-bold ${
                      pred.probability > 75 ? 'text-red-400' : pred.probability > 50 ? 'text-amber-400' : 'text-cyan-400'
                    }`}>
                      {pred.probability}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white font-medium">{pred.remaining_useful_life_days}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                          style={{ width: `${pred.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-400 w-12">{pred.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}