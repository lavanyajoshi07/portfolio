'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit, Trash2, Clock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/useToast'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'

const schema = z.object({
  text: z.string().min(2, 'Log entry text is required'),
  date: z.string().min(2, 'Date (e.g. YYYY-MM) is required'),
  icon: z.string().optional(),
  order: z.number().default(0),
  enabled: z.boolean().default(true).optional(),
})

interface Log {
  _id: string
  text: string
  date: string
  icon?: string
  order: number
  enabled?: boolean
}

export default function ActivityLogsAdminPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLog, setEditingLog] = useState<Log | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      text: '',
      date: '',
      icon: 'Activity',
      order: 0,
      enabled: true,
    },
  })

  const enabledValue = watch('enabled')

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/activity-logs')
      const result = await res.json()
      if (result.success) {
        setLogs(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to retrieve activity logs.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const handleOpenCreate = () => {
    setEditingLog(null)
    reset({
      text: '',
      date: new Date().toISOString().substring(0, 7), // YYYY-MM
      icon: 'Activity',
      order: 0,
      enabled: true,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (log: Log) => {
    setEditingLog(log)
    reset({
      text: log.text,
      date: log.date,
      icon: log.icon || 'Activity',
      order: log.order || 0,
      enabled: log.enabled ?? true,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)
    const url = editingLog ? `/api/activity-logs/${editingLog._id}` : '/api/activity-logs'
    const method = editingLog ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: editingLog ? 'Log updated successfully' : 'Log created successfully',
        })
        setDialogOpen(false)
        fetchLogs()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Operation failed',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Connection failure.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setActionLoading(true)

    try {
      const res = await fetch(`/api/activity-logs/${deleteId}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Log entry deleted successfully.',
        })
        setDeleteId(null)
        fetchLogs()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Deletion failed',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to delete record node.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    {
      header: 'Activity Description',
      accessor: (item: Log) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#00E5FF]" />
          <span className="font-semibold text-slate-200">{item.text}</span>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: (item: Log) => <span className="font-mono text-xs text-slate-400">{item.date}</span>,
    },
    {
      header: 'Icon Name',
      accessor: (item: Log) => <span className="font-mono text-xs text-slate-500">{item.icon || 'Activity'}</span>,
    },
    {
      header: 'Visibility',
      accessor: (item: Log) => (
        <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-full ${
          (item.enabled ?? true)
            ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30' 
            : 'bg-slate-900 text-slate-500 border border-slate-800'
        }`}>
          {(item.enabled ?? true) ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      header: 'Sort Order',
      accessor: (item: Log) => <span className="font-mono text-slate-400">{item.order}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Recent Activities
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Maintain logs for the coding activity timeline
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchLogs}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Log</span>
          </Button>
        </div>
      </div>

      <DataTable
        data={logs}
        columns={columns}
        searchKey="text"
        searchPlaceholder="Filter logs by description..."
        loading={loading}
        actions={(item: Log) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenEdit(item)}
              className="border-slate-800 hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 text-slate-400 hover:text-white"
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteId(item._id)}
              className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingLog ? 'Modify Activity Log' : 'Add Activity Log'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Log Entry Text</Label>
              <Input
                {...register('text')}
                placeholder="e.g. AWS Cloud Practitioner certification earned"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.text && <p className="text-xs text-red-500 font-mono">{errors.text.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Date (e.g. YYYY-MM)</Label>
                <Input
                  {...register('date')}
                  placeholder="2026-06"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
                {errors.date && <p className="text-xs text-red-500 font-mono">{errors.date.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Sort Order</Label>
                <Input
                  type="number"
                  {...register('order', { valueAsNumber: true })}
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Lucide Icon Name</Label>
                <Input
                  {...register('icon')}
                  placeholder="Layout, Terminal, Award..."
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Switch
                  checked={enabledValue}
                  onCheckedChange={(checked: boolean) => setValue('enabled', checked)}
                />
                <div>
                  <Label className="font-mono text-[10px] text-slate-300 uppercase">Enabled</Label>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-900 font-mono text-xs uppercase tracking-wider">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-slate-800 bg-transparent text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white"
              >
                {actionLoading ? 'Saving...' : editingLog ? 'Save Changes' : 'Deploy Log'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Destroy Activity Log"
        description="Are you sure you want to delete this log entry? This will purge it permanently."
        confirmText="Confirm Purge"
      />
    </div>
  )
}
