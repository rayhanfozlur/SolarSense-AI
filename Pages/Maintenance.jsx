import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Wrench, Calendar, DollarSign, User, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export default function Maintenance() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['maintenanceTasks'],
    queryFn: () => base44.entities.MaintenanceTask.list('-created_date'),
    initialData: []
  });

  const { data: sites } = useQuery({
    queryKey: ['sites'],
    queryFn: () => base44.entities.SolarSite.list(),
    initialData: []
  });

  const createTaskMutation = useMutation({
    mutationFn: (data) => base44.entities.MaintenanceTask.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceTasks'] });
      setShowForm(false);
      setEditingTask(null);
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MaintenanceTask.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceTasks'] });
      setShowForm(false);
      setEditingTask(null);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const selectedSite = sites.find(s => s.id === formData.get('site_id'));
    
    const data = {
      site_id: formData.get('site_id'),
      site_name: selectedSite?.name || '',
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      task_type: formData.get('task_type'),
      scheduled_date: formData.get('scheduled_date'),
      status: formData.get('status'),
      estimated_cost: parseFloat(formData.get('estimated_cost')) || 0,
      assigned_to: formData.get('assigned_to'),
      notes: formData.get('notes')
    };

    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, data });
    } else {
      createTaskMutation.mutate(data);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'from-red-500 to-orange-400';
      case 'high': return 'from-orange-500 to-amber-400';
      case 'medium': return 'from-amber-500 to-yellow-400';
      default: return 'from-cyan-500 to-blue-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'in_progress': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
      case 'cancelled': return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
      default: return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    }
  };

  const stats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
            Maintenance Tasks
          </h1>
          <p className="text-slate-400">Schedule and track maintenance activities</p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending', value: stats.pending, color: 'from-amber-500 to-yellow-400' },
          { label: 'In Progress', value: stats.in_progress, color: 'from-cyan-500 to-blue-400' },
          { label: 'Completed', value: stats.completed, color: 'from-emerald-500 to-green-400' },
          { label: 'Urgent', value: stats.urgent, color: 'from-red-500 to-orange-400' }
        ].map((stat, idx) => (
          <div key={idx} className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
            <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
            <p className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {editingTask ? 'Edit Task' : 'New Maintenance Task'}
            </h2>
            <button onClick={() => { setShowForm(false); setEditingTask(null); }}>
              <X className="w-6 h-6 text-slate-400 hover:text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="site_id" className="text-slate-300">Solar Site</Label>
              <Select name="site_id" defaultValue={editingTask?.site_id} required>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map(site => (
                    <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title" className="text-slate-300">Task Title</Label>
              <Input id="title" name="title" defaultValue={editingTask?.title} required className="bg-slate-900/50 border-slate-700 text-white" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-slate-300">Description</Label>
              <Textarea id="description" name="description" defaultValue={editingTask?.description} className="bg-slate-900/50 border-slate-700 text-white" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-slate-300">Priority</Label>
              <Select name="priority" defaultValue={editingTask?.priority || 'medium'}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task_type" className="text-slate-300">Task Type</Label>
              <Select name="task_type" defaultValue={editingTask?.task_type || 'inspection'}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                  <SelectItem value="calibration">Calibration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_date" className="text-slate-300">Scheduled Date</Label>
              <Input id="scheduled_date" name="scheduled_date" type="date" defaultValue={editingTask?.scheduled_date} className="bg-slate-900/50 border-slate-700 text-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-slate-300">Status</Label>
              <Select name="status" defaultValue={editingTask?.status || 'pending'}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_cost" className="text-slate-300">Estimated Cost ($)</Label>
              <Input id="estimated_cost" name="estimated_cost" type="number" step="0.01" defaultValue={editingTask?.estimated_cost} className="bg-slate-900/50 border-slate-700 text-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned_to" className="text-slate-300">Assigned To</Label>
              <Input id="assigned_to" name="assigned_to" defaultValue={editingTask?.assigned_to} className="bg-slate-900/50 border-slate-700 text-white" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes" className="text-slate-300">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={editingTask?.notes} className="bg-slate-900/50 border-slate-700 text-white" rows={2} />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingTask(null); }} className="border-slate-700 text-slate-300">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                {editingTask ? 'Update' : 'Create'} Task
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6 hover:border-amber-500/30 transition-all duration-200"
          >
            <div className="flex items-start gap-6">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getPriorityColor(task.priority)} flex items-center justify-center shrink-0 shadow-lg`}>
                <Wrench className="w-7 h-7 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{task.title}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{task.description}</p>
                    <p className="text-xs text-slate-500">{task.site_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {task.scheduled_date && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/30 rounded-lg">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-xs text-slate-500">Scheduled</p>
                        <p className="text-sm text-white font-medium">
                          {format(new Date(task.scheduled_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  )}
                  {task.estimated_cost > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/30 rounded-lg">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="text-xs text-slate-500">Estimated Cost</p>
                        <p className="text-sm text-white font-medium">${task.estimated_cost}</p>
                      </div>
                    </div>
                  )}
                  {task.assigned_to && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/30 rounded-lg">
                      <User className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-slate-500">Assigned To</p>
                        <p className="text-sm text-white font-medium">{task.assigned_to}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/30 rounded-lg">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-xs text-slate-500">Type</p>
                      <p className="text-sm text-white font-medium capitalize">{task.task_type}</p>
                    </div>
                  </div>
                </div>

                {task.notes && (
                  <div className="mb-4 px-4 py-3 bg-slate-900/30 rounded-lg border border-slate-700/30">
                    <p className="text-xs text-slate-400 mb-1">Notes:</p>
                    <p className="text-sm text-white">{task.notes}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingTask(task);
                      setShowForm(true);
                    }}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30"
                  >
                    Edit
                  </Button>
                  {task.status !== 'completed' && (
                    <Button
                      size="sm"
                      onClick={() => updateTaskMutation.mutate({ id: task.id, data: { ...task, status: 'completed', completed_date: new Date().toISOString().split('T')[0] } })}
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-20 rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30">
            <Wrench className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">No Maintenance Tasks</h3>
            <p className="text-slate-500 mb-6">Create your first maintenance task</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}