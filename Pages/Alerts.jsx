import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, AlertCircle, Info, CheckCircle, 
  Clock, Filter, ChevronDown, X, Eye 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

export default function Alerts() {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.list('-created_date')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Alert.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['alerts'])
  });

  const severityConfig = {
    critical: {
      icon: AlertTriangle,
      bg: "from-red-500/20 to-red-600/5",
      border: "border-red-500/40",
      badge: "bg-red-500/20 text-red-300 border-red-500/30",
      iconColor: "text-red-400"
    },
    warning: {
      icon: AlertCircle,
      bg: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/40",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      iconColor: "text-amber-400"
    },
    info: {
      icon: Info,
      bg: "from-cyan-500/20 to-cyan-600/5",
      border: "border-cyan-500/40",
      badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      iconColor: "text-cyan-400"
    }
  };

  const statusConfig = {
    active: { badge: "bg-red-500/20 text-red-300", label: "Active" },
    acknowledged: { badge: "bg-amber-500/20 text-amber-300", label: "Acknowledged" },
    resolved: { badge: "bg-emerald-500/20 text-emerald-300", label: "Resolved" }
  };

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = severityFilter === 'all' || alert.severity === severityFilter;
    const statusMatch = statusFilter === 'all' || alert.status === statusFilter;
    return severityMatch && statusMatch;
  });

  const handleAcknowledge = (alert) => {
    updateMutation.mutate({ id: alert.id, data: { status: 'acknowledged' } });
  };

  const handleResolve = (alert) => {
    updateMutation.mutate({ id: alert.id, data: { status: 'resolved' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Alerts & Predictions</h1>
            <p className="text-slate-400 mt-1">AI-powered failure predictions and system alerts</p>
          </div>
          <div className="flex gap-3">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-white">
                <Filter size={14} className="mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-center">
            <p className="text-3xl font-bold text-red-400">
              {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}
            </p>
            <p className="text-sm text-slate-400">Critical Active</p>
          </div>
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">
              {alerts.filter(a => a.severity === 'warning' && a.status === 'active').length}
            </p>
            <p className="text-sm text-slate-400">Warnings</p>
          </div>
          <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/30 p-4 text-center">
            <p className="text-3xl font-bold text-cyan-400">
              {alerts.filter(a => a.status === 'acknowledged').length}
            </p>
            <p className="text-sm text-slate-400">Acknowledged</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">
              {alerts.filter(a => a.status === 'resolved').length}
            </p>
            <p className="text-sm text-slate-400">Resolved</p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAlerts.map((alert, index) => {
              const config = severityConfig[alert.severity] || severityConfig.info;
              const Icon = config.icon;
              const status = statusConfig[alert.status] || statusConfig.active;

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl bg-gradient-to-r ${config.bg} border ${config.border} p-5`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-white/5 ${config.iconColor}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                        <Badge className={config.badge}>{alert.severity}</Badge>
                        <Badge className={status.badge}>{status.label}</Badge>
                      </div>
                      <p className="text-slate-400 mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>{alert.site_name}</span>
                        {alert.time_to_failure_days && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {alert.time_to_failure_days} days to failure
                            </span>
                          </>
                        )}
                        {alert.confidence && (
                          <>
                            <span>•</span>
                            <span>{alert.confidence}% confidence</span>
                          </>
                        )}
                        {alert.created_date && (
                          <>
                            <span>•</span>
                            <span>{format(new Date(alert.created_date), 'MMM d, HH:mm')}</span>
                          </>
                        )}
                      </div>
                      {alert.recommended_action && (
                        <div className="mt-3 p-3 rounded-lg bg-slate-800/50 text-sm">
                          <span className="text-slate-400">Recommended: </span>
                          <span className="text-white">{alert.recommended_action}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-slate-400"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <Eye size={16} />
                      </Button>
                      {alert.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-amber-500/30 text-amber-400"
                          onClick={() => handleAcknowledge(alert)}
                        >
                          Ack
                        </Button>
                      )}
                      {alert.status !== 'resolved' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-emerald-500/30 text-emerald-400"
                          onClick={() => handleResolve(alert)}
                        >
                          <CheckCircle size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-16">
              <CheckCircle size={48} className="mx-auto mb-4 text-emerald-500/50" />
              <h3 className="text-lg font-medium text-white mb-2">No alerts</h3>
              <p className="text-slate-400">All systems are operating normally</p>
            </div>
          )}
        </div>

        {/* Alert Detail Dialog */}
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedAlert && (
                  <>
                    {React.createElement(severityConfig[selectedAlert.severity]?.icon || Info, {
                      size: 20,
                      className: severityConfig[selectedAlert.severity]?.iconColor
                    })}
                    {selectedAlert.title}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedAlert && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge className={severityConfig[selectedAlert.severity]?.badge}>
                    {selectedAlert.severity}
                  </Badge>
                  <Badge className={statusConfig[selectedAlert.status]?.badge}>
                    {statusConfig[selectedAlert.status]?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Description</p>
                  <p className="text-white">{selectedAlert.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Site</p>
                    <p className="text-white">{selectedAlert.site_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Type</p>
                    <p className="text-white capitalize">{selectedAlert.type?.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                {selectedAlert.time_to_failure_days && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Time to Failure</p>
                      <p className="text-white">{selectedAlert.time_to_failure_days} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">AI Confidence</p>
                      <p className="text-white">{selectedAlert.confidence}%</p>
                    </div>
                  </div>
                )}
                {selectedAlert.recommended_action && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Recommended Action</p>
                    <p className="text-white">{selectedAlert.recommended_action}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}