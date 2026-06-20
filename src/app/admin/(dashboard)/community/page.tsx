'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit, Trash2, Users, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/hooks/useToast'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  category: z.enum(['hackathon', 'open_source', 'workshop', 'event', 'other']),
  date: z.string().min(2, 'Date (e.g. YYYY-MM) is required'),
  link: z.string().url('Invalid URL').or(z.literal('')),
  enabled: z.boolean().default(true),
  order: z.number().default(0),
})

interface Item {
  _id: string
  title: string
  description?: string
  category: 'hackathon' | 'open_source' | 'workshop' | 'event' | 'other'
  date: string
  link?: string
  enabled: boolean
  order: number
}

const CATEGORIES = [
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'open_source', label: 'Open Source' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'event', label: 'Conferences & Events' },
  { value: 'other', label: 'Other' },
]

export default function CommunityAdminPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
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
      title: '',
      description: '',
      category: 'hackathon' as any,
      date: '',
      link: '',
      enabled: true,
      order: 0,
    },
  })

  const enabledValue = watch('enabled')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/community')
      const result = await res.json()
      if (result.success) {
        setItems(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to retrieve community logs.',
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
    reset({
      title: '',
      description: '',
      category: 'hackathon',
      date: new Date().toISOString().substring(0, 7), // YYYY-MM
      link: '',
      enabled: true,
      order: 0,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: Item) => {
    setEditingItem(item)
    reset({
      title: item.title,
      description: item.description || '',
      category: item.category,
      date: item.date,
      link: item.link || '',
      enabled: item.enabled,
      order: item.order || 0,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)
    const url = editingItem ? `/api/community/${editingItem._id}` : '/api/community'
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
          title: 'Success',
          description: editingItem ? 'Item updated successfully' : 'Item created successfully',
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
        title: 'Error',
        description: 'Connection error.',
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
      const res = await fetch(`/api/community/${deleteId}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Item record deleted successfully.',
        })
        setDeleteId(null)
        fetchItems()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Purging node failed',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Connection failure during delete.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    {
      header: 'Title / Event',
      accessor: (item: Item) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#00E5FF]" />
          <span className="font-semibold text-slate-200">{item.title}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (item: Item) => {
        const cat = CATEGORIES.find(c => c.value === item.category)
        return <span className="font-mono text-xs text-slate-400 uppercase">{cat?.label || item.category}</span>
      },
    },
    {
      header: 'Date',
      accessor: (item: Item) => <span className="font-mono text-xs text-slate-400">{item.date}</span>,
    },
    {
      header: 'Status',
      accessor: (item: Item) => (
        <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-full ${
          item.enabled 
            ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30' 
            : 'bg-slate-900 text-slate-500 border border-slate-800'
        }`}>
          {item.enabled ? 'Enabled' : 'Disabled'}
        </span>
      ),
    },
    {
      header: 'Sort Order',
      accessor: (item: Item) => <span className="font-mono text-slate-400">{item.order}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Community & Recognition
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Maintain hackathons, open source contributions, workshops, and speaking engagements
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

      <DataTable
        data={items}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Filter items by title..."
        loading={loading}
        actions={(item: Item) => (
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
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-lg backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingItem ? 'Modify Community Event' : 'Add Community Event'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Event Title</Label>
              <Input
                {...register('title')}
                placeholder="e.g. disaster-relief routing tool build"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.title && <p className="text-xs text-red-500 font-mono">{errors.title.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Description / Highlights</Label>
              <Textarea
                {...register('description')}
                placeholder="Provide details about your participation or key outputs..."
                rows={3}
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Category</Label>
                <select
                  {...register('category')}
                  className="w-full bg-[#101827]/70 border border-slate-800 rounded-lg text-slate-300 p-2.5 text-xs font-mono uppercase focus:border-[#00E5FF]/40 focus:ring-0 focus-visible:ring-0 outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-[#0A1020]">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Date (e.g. YYYY-MM)</Label>
                <Input
                  {...register('date')}
                  placeholder="2026-06"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
                {errors.date && <p className="text-xs text-red-500 font-mono">{errors.date.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Event Link (Optional)</Label>
                <Input
                  {...register('link')}
                  placeholder="https://github.com/..."
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
                {errors.link && <p className="text-xs text-red-500 font-mono">{errors.link.message as string}</p>}
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

            <div className="flex items-center gap-3 py-2 border-t border-slate-900 mt-2">
              <Switch
                checked={enabledValue}
                onCheckedChange={(checked) => setValue('enabled', checked)}
              />
              <div>
                <Label className="font-mono text-[10px] text-slate-300 uppercase">Enabled</Label>
                <p className="text-[9px] font-mono text-slate-500 uppercase">Visible on public community widget</p>
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
                {actionLoading ? 'Saving...' : editingItem ? 'Save Changes' : 'Deploy Event'}
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
        title="Destroy Community Item"
        description="Are you sure you want to delete this community event? This will remove the record permanently."
        confirmText="Confirm Purge"
      />
    </div>
  )
}
