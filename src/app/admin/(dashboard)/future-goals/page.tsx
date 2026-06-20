'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit, Trash2, Target, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/hooks/useToast'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'

const schema = z.object({
  text: z.string().min(2, 'Goal description is required'),
  category: z.string().min(2, 'Category (e.g. Cloud, AI) is required'),
  completed: z.boolean().default(false),
  order: z.number().default(0),
  enabled: z.boolean().default(true).optional(),
})

interface Goal {
  _id: string
  text: string
  category: string
  completed: boolean
  order: number
  enabled?: boolean
}

export default function FutureGoalsAdminPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      text: '',
      category: '',
      completed: false,
      order: 0,
      enabled: true,
    },
  })

  const completedValue = watch('completed')
  const enabledValue = watch('enabled')

  const fetchGoals = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/future-goals')
      const result = await res.json()
      if (result.success) {
        setGoals(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to retrieve future goals.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleOpenCreate = () => {
    setEditingGoal(null)
    reset({
      text: '',
      category: '',
      completed: false,
      order: 0,
      enabled: true,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (goal: Goal) => {
    setEditingGoal(goal)
    reset({
      text: goal.text,
      category: goal.category,
      completed: goal.completed,
      order: goal.order || 0,
      enabled: goal.enabled ?? true,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)
    const url = editingGoal ? `/api/future-goals/${editingGoal._id}` : '/api/future-goals'
    const method = editingGoal ? 'PUT' : 'POST'

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
          description: editingGoal ? 'Goal updated successfully' : 'Goal created successfully',
        })
        setDialogOpen(false)
        fetchGoals()
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
        description: 'Protocol connection failure.',
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
      const res = await fetch(`/api/future-goals/${deleteId}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Goal deleted successfully.',
        })
        setDeleteId(null)
        fetchGoals()
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
        description: 'Connection failure during purge.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    {
      header: 'Goal Objective',
      accessor: (item: Goal) => (
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#00E5FF]" />
          <span className="font-semibold text-slate-200">{item.text}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (item: Goal) => <span className="font-mono text-xs text-slate-400 uppercase">{item.category}</span>,
    },
    {
      header: 'Status',
      accessor: (item: Goal) => (
        <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-full ${
          item.completed 
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
            : 'bg-slate-900 text-slate-500 border border-slate-800'
        }`}>
          {item.completed ? 'Completed' : 'Pending'}
        </span>
      ),
    },
    {
      header: 'Visibility',
      accessor: (item: Goal) => (
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
      accessor: (item: Goal) => <span className="font-mono text-slate-400">{item.order}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Future Goals
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Maintain your roadmap milestones
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchGoals}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Goal</span>
          </Button>
        </div>
      </div>

      <DataTable
        data={goals}
        columns={columns}
        searchKey="text"
        searchPlaceholder="Filter goals by text..."
        loading={loading}
        actions={(item: Goal) => (
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
              {editingGoal ? 'Modify Goal Node' : 'Add Goal Node'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Goal Description</Label>
              <Input
                {...register('text')}
                placeholder="e.g. AWS Solutions Architect certification"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.text && <p className="text-xs text-red-500 font-mono">{errors.text.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Category</Label>
                <Input
                  {...register('category')}
                  placeholder="e.g. Cloud, AI"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
                {errors.category && <p className="text-xs text-red-500 font-mono">{errors.category.message as string}</p>}
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

            <div className="grid grid-cols-2 gap-4 py-2 border-t border-slate-900 mt-2">
              <div className="flex items-center gap-3">
                <Switch
                  checked={completedValue}
                  onCheckedChange={(checked) => setValue('completed', checked)}
                />
                <div>
                  <Label className="font-mono text-[10px] text-slate-300 uppercase">Completed</Label>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Check off this roadmap item</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={enabledValue}
                  onCheckedChange={(checked) => setValue('enabled', checked)}
                />
                <div>
                  <Label className="font-mono text-[10px] text-slate-300 uppercase">Enabled / Active</Label>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Showcase this goal on page</p>
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
                {actionLoading ? 'Saving...' : editingGoal ? 'Save Changes' : 'Deploy Goal'}
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
        title="Destroy Goal Node"
        description="Are you sure you want to delete this goal item? This will remove it permanently."
        confirmText="Confirm Purge"
      />
    </div>
  )
}
