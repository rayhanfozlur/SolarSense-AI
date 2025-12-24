import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MapPin, Zap, Calendar, Settings, Trash2, 
  Edit2, Sun, Activity, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import SiteCard from '@/components/dashboard/SiteCard';
import HealthGauge from '@/components/dashboard/HealthGauge';

export default function Sites() {
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity_kw: '',
    panel_count: '',
    inverter_count: '',
    site_type: 'residential',
    status: 'online',
    health_index: 85
  });

  const queryClient = useQueryClient();

  const { data: sites = [], isLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: () => base44.entities.SolarSite.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SolarSite.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sites']);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SolarSite.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sites']);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SolarSite.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['sites'])
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingSite(null);
    setFormData({
      name: '',
      location: '',
      capacity_kw: '',
      panel_count: '',
      inverter_count: '',
      site_type: 'residential',
      status: 'online',
      health_index: 85
    });
  };

  const handleEdit = (site) => {
    setEditingSite(site);
    setFormData({
      name: site.name,
      location: site.location,
      capacity_kw: site.capacity_kw,
      panel_count: site.panel_count || '',
      inverter_count: site.inverter_count || '',
      site_type: site.site_type || 'residential',
      status: site.status || 'online',
      health_index: site.health_index || 85
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      capacity_kw: parseFloat(formData.capacity_kw),
      panel_count: parseInt(formData.panel_count) || 0,
      inverter_count: parseInt(formData.inverter_count) || 0,
      health_index: parseInt(formData.health_index) || 85
    };

    if (editingSite) {
      updateMutation.mutate({ id: editingSite.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const statusColors = {
    online: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    offline: 'bg-red-500/20 text-red-400 border-red-500/30',
    degraded: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    maintenance: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Solar Sites</h1>
            <p className="text-slate-400 mt-1">Manage your solar installations</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          >
            <Plus size={18} className="mr-2" />
            Add Site
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <p className="text-slate-400 text-sm">Total Sites</p>
            <p className="text-2xl font-bold text-white">{sites.length}</p>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <p className="text-slate-400 text-sm">Total Capacity</p>
            <p className="text-2xl font-bold text-emerald-400">
              {sites.reduce((sum, s) => sum + (s.capacity_kw || 0), 0).toLocaleString()} kW
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <p className="text-slate-400 text-sm">Online</p>
            <p className="text-2xl font-bold text-cyan-400">
              {sites.filter(s => s.status === 'online').length}
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <p className="text-slate-400 text-sm">Avg Health</p>
            <p className="text-2xl font-bold text-white">
              {sites.length > 0 
                ? Math.round(sites.reduce((sum, s) => sum + (s.health_index || 85), 0) / sites.length)
                : 0}%
            </p>
          </div>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sites.map((site, index) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-5 hover:border-slate-600/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{site.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                        <MapPin size={14} />
                        <span>{site.location}</span>
                      </div>
                    </div>
                    <Badge className={statusColors[site.status || 'online']}>
                      {site.status || 'online'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-center my-4">
                    <HealthGauge value={site.health_index || 85} size={100} label="" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <p className="text-xs text-slate-400">Capacity</p>
                      <p className="text-white font-semibold">{site.capacity_kw} kW</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Panels</p>
                      <p className="text-white font-semibold">{site.panel_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Type</p>
                      <p className="text-white font-semibold capitalize">{site.site_type || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-slate-600 text-slate-300"
                      onClick={() => handleEdit(site)}
                    >
                      <Edit2 size={14} className="mr-1" /> Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => deleteMutation.mutate(site.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sites.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-16">
              <Sun size={48} className="mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-medium text-white mb-2">No sites yet</h3>
              <p className="text-slate-400 mb-4">Add your first solar site to start monitoring</p>
              <Button onClick={() => setShowForm(true)} variant="outline" className="border-slate-600">
                <Plus size={16} className="mr-2" /> Add Your First Site
              </Button>
            </div>
          )}
        </div>

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSite ? 'Edit Site' : 'Add New Site'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-slate-300">Site Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Main Office Rooftop"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-slate-300">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., San Francisco, CA"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Capacity (kW)</Label>
                  <Input
                    type="number"
                    value={formData.capacity_kw}
                    onChange={(e) => setFormData({...formData, capacity_kw: e.target.value})}
                    placeholder="100"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Panel Count</Label>
                  <Input
                    type="number"
                    value={formData.panel_count}
                    onChange={(e) => setFormData({...formData, panel_count: e.target.value})}
                    placeholder="250"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Site Type</Label>
                  <Select value={formData.site_type} onValueChange={(v) => setFormData({...formData, site_type: v})}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-300">Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="degraded">Degraded</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1 border-slate-600">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  {editingSite ? 'Update' : 'Create'} Site
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}