'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { skillSchema } from '@/lib/validation'
import { Plus, Edit, Trash2, Code2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'

interface Skill {
  _id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai_ml' | 'tools' | 'languages' | 'mobile' | 'other'
  level: number
  yearsOfExperience?: number
  featured: boolean
  order: number
}

const CATEGORIES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'ai_ml', label: 'AI/ML' },
  { value: 'tools', label: 'Tools' },
  { value: 'languages', label: 'Languages' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'other', label: 'Other' },
]

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
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
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      category: 'frontend' as any,
      level: 80,
      yearsOfExperience: 0,
      featured: false,
      order: 0,
    },
  })

  const featuredValue = watch('featured')

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/skills')
      const result = await res.json()
      if (result.success) {
        setSkills(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Query Error',
        description: 'Failed to retrieve skills logs from cluster.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleOpenCreate = () => {
    setEditingSkill(null)
    reset({
      name: '',
      category: 'frontend',
      level: 80,
      yearsOfExperience: 0,
      featured: false,
      order: 0,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill)
    reset({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      yearsOfExperience: skill.yearsOfExperience || 0,
      featured: skill.featured,
      order: skill.order || 0,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)
    const url = editingSkill ? `/api/skills/${editingSkill._id}` : '/api/skills'
    const method = editingSkill ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Database Synced',
          description: editingSkill ? 'Skill modified successfully' : 'New skill node registered',
        })
        setDialogOpen(false)
        fetchSkills()
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
        title: 'Protocol Error',
        description: 'Failed to upload skill database node',
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
      const res = await fetch(`/api/skills/${deleteId}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Skill record deleted successfully.',
        })
        setDeleteId(null)
        fetchSkills()
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
      header: 'Skill Node',
      accessor: (item: Skill) => (
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#00E5FF]" />
          <span className="font-semibold text-slate-200">{item.name}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (item: Skill) => {
        const cat = CATEGORIES.find(c => c.value === item.category)
        return <span className="font-mono text-xs text-slate-400 uppercase">{cat?.label || item.category}</span>
      },
    },
    {
      header: 'Expertise Level',
      accessor: (item: Skill) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="flex-1 h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]" style={{ width: `${item.level}%` }} />
          </div>
          <span className="font-mono text-xs font-semibold text-[#00E5FF]">{item.level}%</span>
        </div>
      ),
    },
    {
      header: 'Featured',
      accessor: (item: Skill) => (
        <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-full ${
          item.featured 
            ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30' 
            : 'bg-slate-900 text-slate-500 border border-slate-800'
        }`}>
          {item.featured ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      header: 'Sort Order',
      accessor: (item: Skill) => <span className="font-mono text-slate-400">{item.order}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Skill Repository
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Maintain technical experience levels
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchSkills}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Skill</span>
          </Button>
        </div>
      </div>

      {/* Main Data Table */}
      <DataTable
        data={skills}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Filter skills by name..."
        loading={loading}
        actions={(item: Skill) => (
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

      {/* Dialog modal for add/edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingSkill ? 'Modify Skill Node' : 'Initialize Skill Node'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Skill Name</Label>
              <Input
                {...register('name')}
                placeholder="e.g. TypeScript"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.name && <p className="text-xs text-red-500 font-mono">{errors.name.message as string}</p>}
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
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Expertise Level (%)</Label>
                <Input
                  type="number"
                  {...register('level', { valueAsNumber: true })}
                  min={0}
                  max={100}
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
                {errors.level && <p className="text-xs text-red-500 font-mono">{errors.level.message as string}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Years of Exp</Label>
                <Input
                  type="number"
                  {...register('yearsOfExperience', { valueAsNumber: true })}
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Order Position</Label>
                <Input
                  type="number"
                  {...register('order', { valueAsNumber: true })}
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 border-t border-slate-900 mt-2">
              <Switch
                checked={featuredValue}
                onCheckedChange={(checked) => setValue('featured', checked)}
              />
              <div>
                <Label className="font-mono text-[10px] text-slate-300 uppercase">Featured Element</Label>
                <p className="text-[9px] font-mono text-slate-500 uppercase">Showcase on top of public view</p>
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
                {actionLoading ? 'Compiling...' : editingSkill ? 'Modify node' : 'Deploy node'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation alert */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Destroy Skill Record"
        description="Are you sure you want to delete this skill node? This will purge the record permanently from MongoDB."
        confirmText="Confirm Purge"
      />
    </div>
  )
}
