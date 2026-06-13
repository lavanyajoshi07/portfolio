'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema } from '@/lib/validation'
import { Plus, Edit, Trash2, Briefcase, Link2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { generateSlug } from '@/lib/api' // wait, generateSlug is in src/lib/api.ts. We can import it or define it locally in client
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import RichTextEditor from '../components/RichTextEditor'

interface Project {
  _id: string
  slug: string
  title: string
  description: string
  longDescription?: string
  coverImage?: string
  technologies: string[]
  category?: string
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  status: 'completed' | 'in_progress' | 'archived'
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
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
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      longDescription: '',
      technologies: [] as string[],
      category: '',
      githubUrl: '',
      liveUrl: '',
      featured: false,
      status: 'completed' as any,
      coverImage: '',
    },
  })

  const featuredValue = watch('featured')
  const longDescValue = watch('longDescription')
  const [techString, setTechString] = useState('')

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects')
      const result = await res.json()
      if (result.success) {
        setProjects(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Query Error',
        description: 'Failed to retrieve project logs.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleOpenCreate = () => {
    setEditingProject(null)
    setTechString('')
    reset({
      title: '',
      description: '',
      longDescription: '',
      technologies: [],
      category: '',
      githubUrl: '',
      liveUrl: '',
      featured: false,
      status: 'completed',
      coverImage: '',
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project)
    setTechString(project.technologies.join(', '))
    reset({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || '',
      technologies: project.technologies,
      category: project.category || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: project.featured,
      status: project.status,
      coverImage: project.coverImage || '',
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)
    
    // Parse technologies from comma-separated string
    const parsedTechs = techString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
    
    data.technologies = parsedTechs

    // Auto generate slug on client
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    const projectPayload = {
      ...data,
      slug,
    }

    const url = editingProject ? `/api/projects/${editingProject._id}` : '/api/projects'
    const method = editingProject ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload),
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Database Updated',
          description: editingProject ? 'Project parameters adjusted' : 'Project registered in MongoDB index',
        })
        setDialogOpen(false)
        fetchProjects()
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
        description: 'Failed to deploy project modifications',
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
      const res = await fetch(`/api/projects/${deleteId}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Project catalog card deleted.',
        })
        setDeleteId(null)
        fetchProjects()
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
        description: 'Failed to execute record purge.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    {
      header: 'Project Node',
      accessor: (item: Project) => (
        <div className="flex items-center gap-3">
          <Briefcase className="w-4.5 h-4.5 text-[#7C3AED]" />
          <div>
            <span className="font-semibold text-slate-200 block">{item.title}</span>
            <span className="font-mono text-[9px] text-[#00E5FF]">{item.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (item: Project) => <span className="font-mono text-xs text-slate-400 uppercase">{item.category || 'N/A'}</span>,
    },
    {
      header: 'Stack Array',
      accessor: (item: Project) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {item.technologies.slice(0, 3).map((t, i) => (
            <span key={i} className="font-mono text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
              {t}
            </span>
          ))}
          {item.technologies.length > 3 && <span className="text-[9px] text-slate-500 font-mono">+{item.technologies.length - 3}</span>}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (item: Project) => {
        const statuses = {
          completed: 'bg-green-950/20 text-green-400 border border-green-500/20',
          in_progress: 'bg-yellow-950/20 text-yellow-500 border border-yellow-500/20',
          archived: 'bg-slate-900 text-slate-500 border border-slate-800',
        }
        return (
          <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full ${statuses[item.status]}`}>
            {item.status.replace('_', ' ')}
          </span>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Project Indexer
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Log portfolio projects and code stacks
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchProjects}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Project</span>
          </Button>
        </div>
      </div>

      {/* Projects DataTable */}
      <DataTable
        data={projects}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Filter project logs by title..."
        loading={loading}
        actions={(item: Project) => (
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

      {/* Create / Edit Project Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingProject ? 'Modify Project Parameters' : 'Deploy Project Node'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-3 max-h-[75vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Project Title</Label>
                <Input
                  {...register('title')}
                  placeholder="e.g. AI Speech Agent"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
                {errors.title && <p className="text-xs text-red-500 font-mono">{errors.title.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Category</Label>
                <Input
                  {...register('category')}
                  placeholder="e.g. Artificial Intelligence"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Brief Description</Label>
              <Input
                {...register('description')}
                placeholder="A concise summary..."
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.description && <p className="text-xs text-red-500 font-mono">{errors.description.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Technical Stack (Comma Separated)</Label>
              <Input
                value={techString}
                onChange={(e) => setTechString(e.target.value)}
                placeholder="React, Next.js, FastAPI, Python"
                className="bg-[#101827]/70 border-slate-800 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">GitHub URI</Label>
                <Input
                  {...register('githubUrl')}
                  placeholder="GitHub repo URL"
                  className="bg-[#101827]/70 border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Live Demo URI</Label>
                <Input
                  {...register('liveUrl')}
                  placeholder="Live URL link"
                  className="bg-[#101827]/70 border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Cover Image Path</Label>
                <Input
                  {...register('coverImage')}
                  placeholder="/placeholders/project.png or Cloudinary URL"
                  className="bg-[#101827]/70 border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Project Status</Label>
                <select
                  {...register('status')}
                  className="w-full bg-[#101827]/70 border border-slate-800 rounded-lg text-slate-300 p-2 text-xs font-mono uppercase focus:border-[#00E5FF]/40 outline-none"
                >
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Full Documentation (Markdown)</Label>
              <RichTextEditor
                value={longDescValue || ''}
                onChange={(val) => setValue('longDescription', val, { shouldDirty: true })}
                placeholder="Include features, challenges, lessons..."
                rows={6}
              />
            </div>

            <div className="flex items-center gap-3 py-2 border-t border-slate-900 mt-2">
              <Switch
                checked={featuredValue}
                onCheckedChange={(checked) => setValue('featured', checked)}
              />
              <div>
                <Label className="font-mono text-[10px] text-slate-300 uppercase">Featured Element</Label>
                <p className="text-[9px] font-mono text-slate-500 uppercase">Showcase in hero carousel projects</p>
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
                {actionLoading ? 'Deploying...' : editingProject ? 'Apply Changes' : 'Initialize Node'}
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
        title="Destroy Project Node"
        description="Warning: Proceeding will remove this project entry and all associated view log summaries. Irreversible database operation."
      />
    </div>
  )
}
