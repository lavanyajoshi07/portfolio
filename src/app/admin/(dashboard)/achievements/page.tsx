'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { achievementSchema } from '@/lib/validation'
import { Plus, Edit, Trash2, Trophy, RefreshCw, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'

interface Achievement {
  _id: string
  title: string
  description?: string
  type: 'hackathon' | 'competition' | 'leadership' | 'academic' | 'award' | 'other'
  date: string
  position?: string
  organizer?: string
}

const TYPES = [
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'competition', label: 'Competition' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'academic', label: 'Academic' },
  { value: 'award', label: 'Award' },
  { value: 'other', label: 'Other' },
]

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'hackathon' as any,
      date: '',
      position: '',
      organizer: '',
    },
  })

  const fetchAchievements = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/achievements')
      const result = await res.json()
      if (result.success) {
        setAchievements(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Query Error',
        description: 'Failed to retrieve achievements logs.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAchievements()
  }, [])

  const handleOpenCreate = () => {
    setEditingAchievement(null)
    reset({
      title: '',
      description: '',
      type: 'hackathon',
      date: '',
      position: '',
      organizer: '',
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    reset({
      title: achievement.title,
      description: achievement.description || '',
      type: achievement.type,
      date: achievement.date,
      position: achievement.position || '',
      organizer: achievement.organizer || '',
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)
    const url = editingAchievement ? `/api/achievements/${editingAchievement._id}` : '/api/achievements'
    const method = editingAchievement ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Database Updated',
          description: editingAchievement ? 'Achievement record modified' : 'Achievement record registered',
        })
        setDialogOpen(false)
        fetchAchievements()
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
        title: 'Transmission Error',
        description: 'Failed to deploy achievement',
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
      const res = await fetch(`/api/achievements/${deleteId}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Achievement record deleted.',
        })
        setDeleteId(null)
        fetchAchievements()
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
        description: 'Failed to purge record.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    {
      header: 'Award Node',
      accessor: (item: Achievement) => (
        <div className="flex items-center gap-3">
          <Trophy className="w-4.5 h-4.5 text-[#FF4FD8]" />
          <div>
            <span className="font-semibold text-slate-200 block">{item.title}</span>
            <span className="font-mono text-[9px] text-[#00E5FF] uppercase">{item.organizer || 'Organized Node'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: (item: Achievement) => {
        const typeObj = TYPES.find(t => t.value === item.type)
        return <span className="font-mono text-xs text-slate-400 uppercase">{typeObj?.label || item.type}</span>
      },
    },
    {
      header: 'Rank/Position',
      accessor: (item: Achievement) => <span className="font-mono text-slate-200">{item.position || 'Participant'}</span>,
    },
    {
      header: 'Date Logged',
      accessor: (item: Achievement) => (
        <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{item.date}</span>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Achievements Index
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Log hackathons and competitive standings
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchAchievements}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Achievement</span>
          </Button>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={achievements}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Filter achievements by title..."
        loading={loading}
        actions={(item: Achievement) => (
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

      {/* Add/Edit modal dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingAchievement ? 'Modify Achievement Node' : 'Register Achievement Node'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Achievement Title</Label>
              <Input
                {...register('title')}
                placeholder="e.g. Smart India Hackathon Winner"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.title && <p className="text-xs text-red-500 font-mono">{errors.title.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Description Summary</Label>
              <Input
                {...register('description')}
                placeholder="Briefly state the accomplishment details"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Classification</Label>
                <select
                  {...register('type')}
                  className="w-full bg-[#101827]/70 border border-slate-800 rounded-lg text-slate-300 p-2 text-xs font-mono uppercase focus:border-[#00E5FF]/40 outline-none"
                >
                  {TYPES.map((type) => (
                    <option key={type.value} value={type.value} className="bg-[#0A1020]">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Date (e.g. Oct 2025)</Label>
                <Input
                  {...register('date')}
                  placeholder="Oct 2025"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
                {errors.date && <p className="text-xs text-red-500 font-mono">{errors.date.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Standing/Rank</Label>
                <Input
                  {...register('position')}
                  placeholder="e.g. 1st Place / Finalist"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Organizer / Host</Label>
                <Input
                  {...register('organizer')}
                  placeholder="e.g. Ministry of Education"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
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
                {actionLoading ? 'Deploying...' : editingAchievement ? 'Apply Changes' : 'Initialize Node'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Destroy Achievement Record"
        description="Are you sure you want to remove this achievement? This action will permanently modify the index."
      />
    </div>
  )
}
