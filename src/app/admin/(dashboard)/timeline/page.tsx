'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { timelineSchema } from '@/lib/validation'
import { Plus, Edit, Trash2, Calendar, RefreshCw, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'

interface TimelineItem {
  _id: string
  title: string
  description?: string
  type: 'education' | 'project' | 'achievement' | 'milestone' | 'work'
  date: string
  tags?: string[]
  featured?: boolean
  order?: number
}

const TYPES = [
  { value: 'education', label: 'Education' },
  { value: 'project', label: 'Project' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'work', label: 'Work Experience' },
]

export default function TimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [tagsString, setTagsString] = useState('')
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'milestone' as any,
      date: '',
      tags: [] as string[],
    },
  })

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/timeline')
      const result = await res.json()
      if (result.success) {
        setItems(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Query Error',
        description: 'Failed to retrieve timeline logs.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleOpenCreate = () => {
    setEditingItem(null)
    setTagsString('')
    reset({
      title: '',
      description: '',
      type: 'milestone',
      date: '',
      tags: [],
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: TimelineItem) => {
    setEditingItem(item)
    setTagsString((item.tags || []).join(', '))
    reset({
      title: item.title,
      description: item.description || '',
      type: item.type,
      date: item.date,
      tags: item.tags || [],
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)
    
    // Parse tags
    const parsedTags = tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
    data.tags = parsedTags

    const url = editingItem ? `/api/timeline/${editingItem._id}` : '/api/timeline'
    const method = editingItem ? 'PUT' : 'POST'

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
          description: editingItem ? 'Timeline log node adjusted' : 'Timeline log node registered',
        })
        setDialogOpen(false)
        fetchItems()
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
        description: 'Failed to deploy timeline item.',
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
      const res = await fetch(`/api/timeline/${deleteId}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Timeline node entry purged.',
        })
        setDeleteId(null)
        fetchItems()
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
        title: 'System Fault',
        description: 'Failed to delete record node.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    {
      header: 'Timeline Event',
      accessor: (item: TimelineItem) => (
        <div className="flex items-center gap-3">
          <Layers className="w-4.5 h-4.5 text-[#00E5FF]" />
          <div>
            <span className="font-semibold text-slate-200 block">{item.title}</span>
            <span className="text-xs text-slate-400 font-mono block max-w-[250px] truncate">{item.description}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: (item: TimelineItem) => {
        const typeObj = TYPES.find(t => t.value === item.type)
        return <span className="font-mono text-xs text-slate-400 uppercase">{typeObj?.label || item.type}</span>
      },
    },
    {
      header: 'Event Date',
      accessor: (item: TimelineItem) => (
        <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{item.date}</span>
        </div>
      ),
    },
    {
      header: 'Tags',
      accessor: (item: TimelineItem) => (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {(item.tags || []).slice(0, 2).map((t, i) => (
            <span key={i} className="font-mono text-[9px] bg-slate-900 text-[#00E5FF]/80 px-1.5 py-0.5 rounded border border-slate-800">
              {t}
            </span>
          ))}
          {(item.tags || []).length > 2 && <span className="text-[9px] text-slate-500 font-mono">+{(item.tags || []).length - 2}</span>}
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
            Roadmap/Timeline Logs
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Maintain historical milestones and highlights
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchItems}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Event</span>
          </Button>
        </div>
      </div>

      {/* Timeline DataTable */}
      <DataTable
        data={items}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Filter events by title..."
        loading={loading}
        actions={(item: TimelineItem) => (
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

      {/* Add/Edit timeline item dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingItem ? 'Modify Timeline Event' : 'Deploy Timeline Event'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Event Title</Label>
              <Input
                {...register('title')}
                placeholder="e.g. Graduated with Honors"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.title && <p className="text-xs text-red-500 font-mono">{errors.title.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Description / Scope</Label>
              <Input
                {...register('description')}
                placeholder="Details about the event"
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
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Date (e.g. Aug 2026)</Label>
                <Input
                  {...register('date')}
                  placeholder="Aug 2026"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
                {errors.date && <p className="text-xs text-red-500 font-mono">{errors.date.message as string}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Tags / Metadata (Comma Separated)</Label>
              <Input
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="Milestone, Education, Honours"
                className="bg-[#101827]/70 border-slate-800 text-white font-mono text-xs"
              />
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
                {actionLoading ? 'Deploying...' : editingItem ? 'Apply Changes' : 'Initialize Node'}
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
        title="Destroy Timeline Event"
        description="Are you sure you want to delete this event entry? This will permanently modify the roadmap list."
      />
    </div>
  )
}
