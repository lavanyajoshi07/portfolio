'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema } from '@/lib/validation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Briefcase, 
  RefreshCw, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Image as ImageIcon,
  Tag, 
  Search, 
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import RichTextEditor from '../components/RichTextEditor'
import { Project } from '@/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [previewProject, setPreviewProject] = useState<Project | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  // Tab State inside Edit/Create Modal
  const [formTab, setFormTab] = useState<'general' | 'content' | 'media' | 'metrics' | 'highlights' | 'seo' | 'links'>('general')

  // Repeater State holders
  const [keyMetrics, setKeyMetrics] = useState<{ value: string; label: string }[]>([])
  const [highlights, setHighlights] = useState<string[]>([])
  const [techStack, setTechStack] = useState<string[]>([])
  const [gallery, setGallery] = useState<{ image: string; alt: string }[]>([])

  // Simple string trackers for lists mapped from inputs
  const [tagsString, setTagsString] = useState('')
  const [keywordsString, setKeywordsString] = useState('')
  const [seoKeywordsString, setSeoKeywordsString] = useState('')

  const [uploadingImage, setUploadingImage] = useState<string | null>(null) // tracker for current field uploading

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
      shortDescription: '',
      fullDescription: '',
      thumbnail: { image: '', alt: '' },
      gallery: [] as { image: string; alt: string }[],
      architectureDiagram: '',
      category: '',
      status: 'completed' as any,
      publishStatus: 'draft' as any,
      featured: false,
      featuredOrder: 0,
      isPublished: false,
      showOnHomepage: true,
      isCaseStudy: false,
      sortOrder: 0,
      duration: '',
      teamSize: '',
      techStack: [] as string[],
      tags: [] as string[],
      searchKeywords: [] as string[],
      keyMetrics: [] as { value: string; label: string }[],
      highlights: [] as string[],
      problemStatement: '',
      solution: '',
      challenges: '',
      outcomes: '',
      githubUrl: '',
      demoUrl: '',
      documentationUrl: '',
      videoDemoUrl: '',
      showGithub: true,
      showDemo: true,
      showDocumentation: true,
      showVideoDemo: true,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [] as string[],
    },
  })

  // Watchers
  const featuredValue = watch('featured')
  const isPublishedValue = watch('isPublished')
  const publishStatusValue = watch('publishStatus')
  const showOnHomepageValue = watch('showOnHomepage')
  const isCaseStudyValue = watch('isCaseStudy')
  const thumbnailValue = watch('thumbnail')
  const architectureDiagramValue = watch('architectureDiagram')
  const fullDescValue = watch('fullDescription')

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, target: 'thumbnail' | 'diagram' | 'gallery') => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(target)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      if (result.success && result.data?.url) {
        if (target === 'thumbnail') {
          setValue('thumbnail', { image: result.data.url, alt: thumbnailValue?.alt || '' }, { shouldDirty: true })
        } else if (target === 'diagram') {
          setValue('architectureDiagram', result.data.url, { shouldDirty: true })
        } else if (target === 'gallery') {
          setGallery((prev) => [...prev, { image: result.data.url, alt: '' }])
        }
        toast({ title: 'Success', description: 'Image uploaded successfully.' })
      } else {
        toast({ title: 'Upload Failed', description: result.error || 'Failed to upload.', variant: 'destructive' })
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Upload Error', description: 'An error occurred during upload.', variant: 'destructive' })
    } finally {
      setUploadingImage(null)
    }
  }

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
      toast({ title: 'Query Error', description: 'Failed to retrieve project logs.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleOpenCreate = () => {
    setEditingProject(null)
    setFormTab('general')
    setKeyMetrics([])
    setHighlights([])
    setTechStack([])
    setGallery([])
    setTagsString('')
    setKeywordsString('')
    setSeoKeywordsString('')
    reset({
      title: '',
      shortDescription: '',
      fullDescription: '',
      thumbnail: { image: '', alt: '' },
      gallery: [],
      architectureDiagram: '',
      category: '',
      status: 'completed',
      publishStatus: 'draft',
      featured: false,
      featuredOrder: 0,
      isPublished: false,
      showOnHomepage: true,
      isCaseStudy: false,
      sortOrder: 0,
      duration: '',
      teamSize: '',
      techStack: [],
      tags: [],
      searchKeywords: [],
      keyMetrics: [],
      highlights: [],
      problemStatement: '',
      solution: '',
      challenges: '',
      outcomes: '',
      githubUrl: '',
      demoUrl: '',
      documentationUrl: '',
      videoDemoUrl: '',
      showGithub: true,
      showDemo: true,
      showDocumentation: true,
      showVideoDemo: true,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project)
    setFormTab('general')
    setKeyMetrics(project.keyMetrics || [])
    setHighlights(project.highlights || [])
    setTechStack(project.techStack || [])
    setGallery(project.gallery || [])
    setTagsString((project.tags || []).join(', '))
    setKeywordsString((project.searchKeywords || []).join(', '))
    setSeoKeywordsString((project.seoKeywords || []).join(', '))
    reset({
      title: project.title,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription || '',
      thumbnail: project.thumbnail || { image: '', alt: '' },
      gallery: project.gallery || [],
      architectureDiagram: project.architectureDiagram || '',
      category: project.category || '',
      status: project.status,
      publishStatus: project.publishStatus || (project.isPublished ? 'published' : 'draft'),
      featured: project.featured,
      featuredOrder: project.featuredOrder || 0,
      isPublished: project.isPublished,
      showOnHomepage: project.showOnHomepage,
      isCaseStudy: project.isCaseStudy,
      sortOrder: project.sortOrder || 0,
      duration: project.duration || '',
      teamSize: project.teamSize || '',
      techStack: project.techStack,
      tags: project.tags,
      searchKeywords: project.searchKeywords,
      keyMetrics: project.keyMetrics,
      highlights: project.highlights,
      problemStatement: project.problemStatement || '',
      solution: project.solution || '',
      challenges: project.challenges || '',
      outcomes: project.outcomes || '',
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      documentationUrl: project.documentationUrl || '',
      videoDemoUrl: project.videoDemoUrl || '',
      showGithub: project.showGithub ?? true,
      showDemo: project.showDemo ?? true,
      showDocumentation: project.showDocumentation ?? true,
      showVideoDemo: project.showVideoDemo ?? true,
      seoTitle: project.seoTitle || '',
      seoDescription: project.seoDescription || '',
      seoKeywords: project.seoKeywords,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)

    // Assemble arrays
    data.keyMetrics = keyMetrics
    data.highlights = highlights
    data.techStack = techStack
    data.gallery = gallery

    data.tags = tagsString.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
    data.searchKeywords = keywordsString.split(',').map((k) => k.trim()).filter((k) => k.length > 0)
    data.seoKeywords = seoKeywordsString.split(',').map((s) => s.trim()).filter((s) => s.length > 0)

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    const payload = {
      ...data,
      slug,
    }

    const url = editingProject ? `/api/projects/${editingProject._id}` : '/api/projects'
    const method = editingProject ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Database Updated',
          description: editingProject ? 'Project parameters adjusted.' : 'Project registered in MongoDB index.',
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
        toast({ title: 'Success', description: 'Project catalog card deleted.' })
        setDeleteId(null)
        fetchProjects()
      } else {
        toast({ title: 'Error', description: result.error || 'Deletion failed', variant: 'destructive' })
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'System Fault', description: 'Failed to execute record purge.', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  // Swap Reordering Helpers
  const handleMoveItem = (type: 'metrics' | 'highlights' | 'tech' | 'gallery', index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (type === 'metrics') {
      if (targetIdx < 0 || targetIdx >= keyMetrics.length) return
      const list = [...keyMetrics]
      const temp = list[index]
      list[index] = list[targetIdx]
      list[targetIdx] = temp
      setKeyMetrics(list)
    } else if (type === 'highlights') {
      if (targetIdx < 0 || targetIdx >= highlights.length) return
      const list = [...highlights]
      const temp = list[index]
      list[index] = list[targetIdx]
      list[targetIdx] = temp
      setHighlights(list)
    } else if (type === 'tech') {
      if (targetIdx < 0 || targetIdx >= techStack.length) return
      const list = [...techStack]
      const temp = list[index]
      list[index] = list[targetIdx]
      list[targetIdx] = temp
      setTechStack(list)
    } else if (type === 'gallery') {
      if (targetIdx < 0 || targetIdx >= gallery.length) return
      const list = [...gallery]
      const temp = list[index]
      list[index] = list[targetIdx]
      list[targetIdx] = temp
      setGallery(list)
    }
  }

  const handlePreviewCurrentState = () => {
    const values = watch()
    const slug = (values.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const currentProject: Project = {
      ...values,
      slug,
      keyMetrics,
      highlights,
      techStack,
      gallery,
      tags: tagsString.split(',').map((t) => t.trim()).filter((t) => t.length > 0),
      searchKeywords: keywordsString.split(',').map((k) => k.trim()).filter((k) => k.length > 0),
      seoKeywords: seoKeywordsString.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
      viewCount: editingProject?.viewCount || 0
    }
    setPreviewProject(currentProject)
  }

  const columns = [
    {
      header: 'Project Product',
      accessor: (item: Project) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#101827] border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            {item.thumbnail?.image ? (
              <img src={item.thumbnail.image} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <Briefcase className="w-4.5 h-4.5 text-[#00E5FF]" />
            )}
          </div>
          <div>
            <span className="font-semibold text-slate-200 block">{item.title}</span>
            <span className="font-mono text-[9px] text-[#00E5FF]">{item.category || 'No Category'}</span>
          </div>
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
    {
      header: 'Homepage',
      accessor: (item: Project) => (
        <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full ${
          item.showOnHomepage
            ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30'
            : 'bg-slate-900 text-slate-500 border border-slate-800'
        }`}>
          {item.showOnHomepage ? 'Visible' : 'Hidden'}
        </span>
      ),
    },
    {
      header: 'Workflow',
      accessor: (item: Project) => {
        const publishStatuses: Record<string, string> = {
          published: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
          preview: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
          draft: 'bg-slate-800 text-slate-400 border border-slate-700',
        }
        const statusVal = item.publishStatus || (item.isPublished ? 'published' : 'draft')
        return (
          <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full ${publishStatuses[statusVal] || publishStatuses.draft}`}>
            {statusVal}
          </span>
        )
      },
    },
    {
      header: 'Featured',
      accessor: (item: Project) => (
        <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full ${
          item.featured
            ? 'bg-[#FF4FD8]/15 text-[#FF4FD8] border border-[#FF4FD8]/30'
            : 'bg-slate-900 text-slate-500 border border-slate-800'
        }`}>
          {item.featured ? 'Featured' : 'No'}
        </span>
      ),
    },
    {
      header: 'Order',
      accessor: (item: Project) => <span className="font-mono text-slate-400">{item.sortOrder || 0}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Product Indexer
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Maintain portfolio SaaS-style showcase projects & parameters
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
            <span>Add Showcase</span>
          </Button>
        </div>
      </div>

      {/* Projects Table */}
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
              onClick={() => setPreviewProject(item)}
              className="border-slate-800 hover:border-[#FF4FD8]/30 hover:bg-[#FF4FD8]/5 text-slate-400 hover:text-white"
              title="Preview Showcase"
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
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
              onClick={() => setDeleteId(item._id!)}
              className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      {/* Dialog Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-3xl backdrop-blur-xl flex flex-col h-[90vh]">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingProject ? 'Modify Product Parameters' : 'Deploy Product Node'}
            </DialogTitle>
          </DialogHeader>

          {/* Dialog Tabs list */}
          <div className="flex border-b border-slate-900 font-mono text-[10px] uppercase tracking-wider overflow-x-auto gap-2 py-1 select-none">
            {['general', 'content', 'media', 'metrics', 'highlights', 'seo', 'links'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFormTab(tab as any)}
                className={`px-3 py-2 border-b-2 transition-all ${
                  formTab === tab 
                    ? 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5' 
                    : 'border-transparent text-slate-500 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-3 flex-1 overflow-y-auto pr-2">
            
            {/* TAB 1: GENERAL */}
            {formTab === 'general' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Product Title</Label>
                    <Input {...register('title')} placeholder="e.g. Agentic Support System" className="bg-[#101827]/70 border-slate-800 text-white" />
                    {errors.title && <p className="text-xs text-red-500 font-mono">{errors.title.message as string}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Category Tag</Label>
                    <Input {...register('category')} placeholder="e.g. AI & Automation" className="bg-[#101827]/70 border-slate-800 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Duration (Duration)</Label>
                    <Input {...register('duration')} placeholder="e.g. 3 Months" className="bg-[#101827]/70 border-slate-800 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Team Size</Label>
                    <Input {...register('teamSize')} placeholder="e.g. Solo" className="bg-[#101827]/70 border-slate-800 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Status</Label>
                    <select
                      {...register('status')}
                      className="w-full bg-[#101827]/70 border border-slate-800 rounded-lg text-slate-300 p-2 text-xs font-mono uppercase focus:border-[#00E5FF]/40 outline-none h-10"
                    >
                      <option value="completed">Completed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Display Sort Order</Label>
                    <Input type="number" {...register('sortOrder', { valueAsNumber: true })} className="bg-[#101827]/70 border-slate-800 text-white font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Featured Order</Label>
                    <Input type="number" {...register('featuredOrder', { valueAsNumber: true })} className="bg-[#101827]/70 border-slate-800 text-white font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-900 pt-4 items-end">
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <Label className="font-mono text-[9px] text-slate-500 uppercase">Publish Flow</Label>
                    <select
                      value={publishStatusValue || 'draft'}
                      onChange={(e) => {
                        const val = e.target.value as 'draft' | 'preview' | 'published'
                        setValue('publishStatus', val, { shouldDirty: true })
                        setValue('isPublished', val === 'published', { shouldDirty: true })
                      }}
                      className="w-full bg-[#101827]/70 border border-slate-800 rounded-lg text-slate-300 px-2 py-1 text-xs font-mono uppercase focus:border-[#00E5FF]/40 outline-none h-8"
                    >
                      <option value="draft">Draft</option>
                      <option value="preview">Preview</option>
                      <option value="published">Publish</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={showOnHomepageValue} onCheckedChange={(checked) => setValue('showOnHomepage', checked)} />
                    <div>
                      <Label className="font-mono text-[9px] text-slate-300 uppercase">Show Home</Label>
                      <p className="text-[7px] font-mono text-slate-500 uppercase">Active grid list</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={featuredValue} onCheckedChange={(checked) => setValue('featured', checked)} />
                    <div>
                      <Label className="font-mono text-[9px] text-slate-300 uppercase">Featured</Label>
                      <p className="text-[7px] font-mono text-slate-500 uppercase">Showcase tier</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={isCaseStudyValue} onCheckedChange={(checked) => setValue('isCaseStudy', checked)} />
                    <div>
                      <Label className="font-mono text-[9px] text-slate-300 uppercase">Case Study</Label>
                      <p className="text-[7px] font-mono text-slate-500 uppercase">Flagship showcase</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONTENT */}
            {formTab === 'content' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-mono text-[10px] text-slate-500 uppercase">Short Description (Cards grid)</Label>
                  <Textarea {...register('shortDescription')} rows={2} placeholder="SaaS card summary..." className="bg-[#101827]/70 border-slate-800 text-white" />
                  {errors.shortDescription && <p className="text-xs text-red-500 font-mono">{errors.shortDescription.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Problem Statement</Label>
                    <Textarea {...register('problemStatement')} rows={3} placeholder="What pain point was resolved..." className="bg-[#101827]/70 border-slate-800 text-white text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Product Solution</Label>
                    <Textarea {...register('solution')} rows={3} placeholder="How it works..." className="bg-[#101827]/70 border-slate-800 text-white text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Challenges Faced</Label>
                    <Textarea {...register('challenges')} rows={3} placeholder="Technical bottlenecks..." className="bg-[#101827]/70 border-slate-800 text-white text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Key Outcomes / Impact</Label>
                    <Textarea {...register('outcomes')} rows={3} placeholder="Results achieved..." className="bg-[#101827]/70 border-slate-800 text-white text-xs" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-mono text-[10px] text-slate-500 uppercase">Full Documentation (Markdown)</Label>
                  <RichTextEditor
                    value={fullDescValue || ''}
                    onChange={(val) => setValue('fullDescription', val, { shouldDirty: true })}
                    placeholder="Provide full technical walkthrough..."
                    rows={8}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: MEDIA */}
            {formTab === 'media' && (
              <div className="space-y-5">
                {/* Thumbnail upload */}
                <div className="grid grid-cols-2 gap-4 border border-slate-900 p-3 rounded-lg bg-[#0F172A]/50">
                  <div className="space-y-1.5 justify-center">
                    <Label className="font-mono text-[10px] text-slate-400 uppercase">Thumbnail Screenshot</Label>
                    <div className="flex gap-2">
                      <Input
                        value={thumbnailValue?.image || ''}
                        onChange={(e) => setValue('thumbnail', { image: e.target.value, alt: thumbnailValue?.alt || '' })}
                        placeholder="Image URL"
                        className="bg-[#101827]/70 border-slate-800 text-white text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="relative overflow-hidden border-slate-800 bg-[#101827]/70 font-mono text-[10px] cursor-pointer"
                        disabled={uploadingImage !== null}
                      >
                        {uploadingImage === 'thumbnail' ? '...' : <Upload className="w-3.5 h-3.5" />}
                        <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, 'thumbnail')} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </Button>
                    </div>
                    <Input
                      value={thumbnailValue?.alt || ''}
                      onChange={(e) => setValue('thumbnail', { image: thumbnailValue?.image || '', alt: e.target.value })}
                      placeholder="Alt Text (SEO/Accessibility)"
                      className="bg-[#101827]/70 border-slate-800 text-white text-xs mt-2"
                    />
                  </div>
                  <div className="flex items-center justify-center bg-slate-950 rounded border border-slate-900 h-24 overflow-hidden">
                    {thumbnailValue?.image ? (
                      <img src={thumbnailValue.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-700" />
                    )}
                  </div>
                </div>

                {/* Architecture Diagram */}
                <div className="grid grid-cols-2 gap-4 border border-slate-900 p-3 rounded-lg bg-[#0F172A]/50">
                  <div className="space-y-1.5 justify-center">
                    <Label className="font-mono text-[10px] text-slate-400 uppercase">Architecture Diagram Diagram</Label>
                    <div className="flex gap-2">
                      <Input
                        value={architectureDiagramValue || ''}
                        onChange={(e) => setValue('architectureDiagram', e.target.value)}
                        placeholder="Image URL"
                        className="bg-[#101827]/70 border-slate-800 text-white text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="relative overflow-hidden border-slate-800 bg-[#101827]/70 font-mono text-[10px] cursor-pointer"
                        disabled={uploadingImage !== null}
                      >
                        {uploadingImage === 'diagram' ? '...' : <Upload className="w-3.5 h-3.5" />}
                        <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, 'diagram')} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center bg-slate-950 rounded border border-slate-900 h-24 overflow-hidden">
                    {architectureDiagramValue ? (
                      <img src={architectureDiagramValue} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-700" />
                    )}
                  </div>
                </div>

                {/* Gallery Repeaters */}
                <div className="border border-slate-900 p-4 rounded-lg bg-[#0F172A]/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <Label className="font-mono text-[10px] text-slate-400 uppercase">Screenshot Gallery</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="relative overflow-hidden text-[9px] font-mono h-7"
                      disabled={uploadingImage !== null}
                    >
                      {uploadingImage === 'gallery' ? 'Uploading...' : 'Add Screenshot'}
                      <input type="file" accept="image/*" onChange={(e) => handleUploadImage(e, 'gallery')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </Button>
                  </div>
                  
                  {gallery.length === 0 && (
                    <p className="text-slate-500 font-mono text-[10px] text-center uppercase">No screenshots uploaded yet.</p>
                  )}

                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {gallery.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-[#101827] border border-slate-800 rounded-lg p-2">
                        <div className="w-12 h-10 bg-slate-950 rounded overflow-hidden shrink-0">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Input
                            value={item.alt}
                            onChange={(e) => {
                              const list = [...gallery]
                              list[idx].alt = e.target.value
                              setGallery(list)
                            }}
                            placeholder="Screenshot Alt Text"
                            className="bg-[#050814] border-slate-800 text-xs text-slate-300 h-7"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => handleMoveItem('gallery', idx, 'up')} disabled={idx === 0} className="p-1 hover:text-white disabled:opacity-30">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => handleMoveItem('gallery', idx, 'down')} disabled={idx === gallery.length - 1} className="p-1 hover:text-white disabled:opacity-30">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setGallery(prev => prev.filter((_, i) => i !== idx))}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: METRICS */}
            {formTab === 'metrics' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <Label className="font-mono text-[10px] text-slate-400 uppercase">Impact Metrics Repeater</Label>
                  <Button
                    type="button"
                    onClick={() => setKeyMetrics(prev => [...prev, { value: '', label: '' }])}
                    className="h-7 text-[10px] font-mono border-slate-800 bg-[#101827]"
                    variant="outline"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Metric
                  </Button>
                </div>

                {keyMetrics.length === 0 && (
                  <p className="text-slate-500 font-mono text-[10px] text-center uppercase py-8">No metrics loaded yet.</p>
                )}

                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                  {keyMetrics.map((metric, idx) => (
                    <div key={idx} className="flex gap-3 bg-[#101827] border border-slate-800 rounded-lg p-3 items-center">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <Input
                          value={metric.value}
                          onChange={(e) => {
                            const list = [...keyMetrics]
                            list[idx].value = e.target.value
                            setKeyMetrics(list)
                          }}
                          placeholder="Value (e.g. 95%)"
                          className="bg-[#050814] border-slate-800 text-xs font-mono h-8 text-white"
                        />
                        <Input
                          value={metric.label}
                          onChange={(e) => {
                            const list = [...keyMetrics]
                            list[idx].label = e.target.value
                            setKeyMetrics(list)
                          }}
                          placeholder="Label (e.g. Accuracy)"
                          className="bg-[#050814] border-slate-800 text-xs h-8 text-white"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => handleMoveItem('metrics', idx, 'up')} disabled={idx === 0} className="p-1 hover:text-white disabled:opacity-30">
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => handleMoveItem('metrics', idx, 'down')} disabled={idx === keyMetrics.length - 1} className="p-1 hover:text-white disabled:opacity-30">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setKeyMetrics(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: HIGHLIGHTS & TECH STACK */}
            {formTab === 'highlights' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Highlights */}
                <div className="space-y-4 border-r border-slate-900 pr-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <Label className="font-mono text-[10px] text-slate-400 uppercase">Highlights checklist</Label>
                    <Button
                      type="button"
                      onClick={() => setHighlights(prev => [...prev, ''])}
                      className="h-7 text-[10px] font-mono border-slate-800 bg-[#101827]"
                      variant="outline"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                    {highlights.map((h, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-[#101827]/40 border border-slate-850 p-1.5 rounded-md">
                        <Input
                          value={h}
                          onChange={(e) => {
                            const list = [...highlights]
                            list[idx] = e.target.value
                            setHighlights(list)
                          }}
                          placeholder="Highlight description..."
                          className="bg-[#050814] border-slate-800 text-xs h-7 text-white flex-1"
                        />
                        <div className="flex items-center gap-0.5">
                          <button type="button" onClick={() => handleMoveItem('highlights', idx, 'up')} disabled={idx === 0} className="p-0.5 hover:text-white disabled:opacity-30">
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button type="button" onClick={() => handleMoveItem('highlights', idx, 'down')} disabled={idx === highlights.length - 1} className="p-0.5 hover:text-white disabled:opacity-30">
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button type="button" onClick={() => setHighlights(prev => prev.filter((_, i) => i !== idx))} className="p-0.5 text-red-400 hover:text-red-300">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack & Tags */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <Label className="font-mono text-[10px] text-slate-400 uppercase">Tech Stack (Chips)</Label>
                    <Button
                      type="button"
                      onClick={() => setTechStack(prev => [...prev, ''])}
                      className="h-7 text-[10px] font-mono border-slate-800 bg-[#101827]"
                      variant="outline"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                    {techStack.map((tech, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-[#101827]/40 border border-slate-850 p-1.5 rounded-md">
                        <Input
                          value={tech}
                          onChange={(e) => {
                            const list = [...techStack]
                            list[idx] = e.target.value
                            setTechStack(list)
                          }}
                          placeholder="e.g. Next.js"
                          className="bg-[#050814] border-slate-800 text-xs h-7 font-mono text-white flex-1"
                        />
                        <div className="flex items-center gap-0.5">
                          <button type="button" onClick={() => handleMoveItem('tech', idx, 'up')} disabled={idx === 0} className="p-0.5 hover:text-white disabled:opacity-30">
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button type="button" onClick={() => handleMoveItem('tech', idx, 'down')} disabled={idx === techStack.length - 1} className="p-0.5 hover:text-white disabled:opacity-30">
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button type="button" onClick={() => setTechStack(prev => prev.filter((_, i) => i !== idx))} className="p-0.5 text-red-400 hover:text-red-300">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-900 pt-4 space-y-3">
                    <div className="space-y-1">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Custom Tags (Comma Separated)</Label>
                      <div className="relative">
                        <Tag className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-500" />
                        <Input value={tagsString} onChange={(e) => setTagsString(e.target.value)} placeholder="AI, RAG, Agent" className="bg-[#101827]/70 border-slate-800 text-xs pl-8 text-white h-9" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Search Keywords (Comma Separated)</Label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-500" />
                        <Input value={keywordsString} onChange={(e) => setKeywordsString(e.target.value)} placeholder="agent, triage, vector" className="bg-[#101827]/70 border-slate-800 text-xs pl-8 text-white h-9" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SEO */}
            {formTab === 'seo' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-mono text-[10px] text-slate-500 uppercase">SEO Title Override</Label>
                  <Input {...register('seoTitle')} placeholder="e.g. Agentic Support System | AI Engineer" className="bg-[#101827]/70 border-slate-800 text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-mono text-[10px] text-slate-500 uppercase">SEO Meta Description</Label>
                  <Textarea {...register('seoDescription')} rows={3} placeholder="Search engine description..." className="bg-[#101827]/70 border-slate-800 text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-mono text-[10px] text-slate-500 uppercase">SEO Keywords (Comma Separated)</Label>
                  <Input value={seoKeywordsString} onChange={(e) => setSeoKeywordsString(e.target.value)} placeholder="AI Agents, LangGraph, FastAPI" className="bg-[#101827]/70 border-slate-800 text-white" />
                </div>
              </div>
            )}

            {/* TAB 7: LINKS */}
            {formTab === 'links' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">GitHub Repo Link</Label>
                    <Input {...register('githubUrl')} placeholder="https://github.com/..." className="bg-[#101827]/70 border-slate-800 text-xs text-white" />
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <Switch checked={watch('showGithub')} onCheckedChange={(checked) => setValue('showGithub', checked)} />
                    <div>
                      <Label className="font-mono text-[9px] text-slate-400 uppercase">Show GitHub Button</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Live Demo Link</Label>
                    <Input {...register('demoUrl')} placeholder="https://demo.dev" className="bg-[#101827]/70 border-slate-800 text-xs text-white" />
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <Switch checked={watch('showDemo')} onCheckedChange={(checked) => setValue('showDemo', checked)} />
                    <div>
                      <Label className="font-mono text-[9px] text-slate-400 uppercase">Show Demo Button</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Documentation URL</Label>
                    <Input {...register('documentationUrl')} placeholder="https://docs.dev" className="bg-[#101827]/70 border-slate-800 text-xs text-white" />
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <Switch checked={watch('showDocumentation')} onCheckedChange={(checked) => setValue('showDocumentation', checked)} />
                    <div>
                      <Label className="font-mono text-[9px] text-slate-400 uppercase">Show Docs Button</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Video Demo URL</Label>
                    <Input {...register('videoDemoUrl')} placeholder="https://youtube.com/..." className="bg-[#101827]/70 border-slate-800 text-xs text-white" />
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <Switch checked={watch('showVideoDemo')} onCheckedChange={(checked) => setValue('showVideoDemo', checked)} />
                    <div>
                      <Label className="font-mono text-[9px] text-slate-400 uppercase">Show Video Button</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4 border-t border-slate-900 font-mono text-xs uppercase tracking-wider flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviewCurrentState}
                className="border-slate-800 bg-transparent text-[#FF4FD8] hover:bg-[#FF4FD8]/5 hover:text-white"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                Preview Mode
              </Button>
              <div className="flex gap-2">
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
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Destroy Project Node"
        description="Warning: Proceeding will remove this project entry and all associated view log summaries. Irreversible database operation."
      />

      {/* Admin Preview Mode Overlay */}
      {previewProject && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-in" onClick={() => setPreviewProject(null)}>
          <div className="bg-[#030712] border border-[#00E5FF]/20 rounded-2xl max-w-4xl w-full my-8 text-slate-200 overflow-hidden relative shadow-2xl shadow-[#00E5FF]/10 scale-up-dialog" onClick={(e) => e.stopPropagation()}>
            
            {/* Header image banner */}
            <div className="relative h-64 bg-[#0A0F1E] border-b border-slate-900 flex items-center justify-center overflow-hidden">
              {previewProject.thumbnail?.image ? (
                <img
                  src={previewProject.thumbnail.image}
                  alt={previewProject.thumbnail.alt || previewProject.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-700 font-mono uppercase text-xs">No Cover Image Deployed</div>
              )}
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider">
                  {previewProject.status}
                </span>
                {previewProject.featured && (
                  <span className="bg-[#FF4FD8]/25 text-[#FF4FD8] border border-[#FF4FD8]/30 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider">
                    Featured Showcase
                  </span>
                )}
                {previewProject.isCaseStudy && (
                  <span className="bg-[#00E5FF]/25 text-[#00E5FF] border border-[#00E5FF]/30 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider">
                    Case Study
                  </span>
                )}
              </div>
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white bg-slate-900/60 hover:bg-slate-950 border border-slate-800 rounded-full w-8 h-8 flex items-center justify-center text-lg transition-all"
              >
                ×
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-8">
              {/* Title & Metadata */}
              <div className="border-b border-slate-900 pb-5">
                <span className="font-mono text-xs text-[#00E5FF] uppercase tracking-widest">{previewProject.category || 'AI Project Showcase'}</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mt-1 uppercase tracking-wide">
                  {previewProject.title}
                </h2>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                  {previewProject.shortDescription}
                </p>

                {/* Duration & Team Size */}
                <div className="flex gap-6 mt-4 font-mono text-[10px] uppercase text-slate-500">
                  {previewProject.duration && (
                    <div>
                      <span className="text-slate-600 mr-1.5">Duration:</span>
                      <span className="text-slate-300 font-semibold">{previewProject.duration}</span>
                    </div>
                  )}
                  {previewProject.teamSize && (
                    <div>
                      <span className="text-slate-600 mr-1.5">Team Size:</span>
                      <span className="text-slate-300 font-semibold">{previewProject.teamSize}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Metrics Dashboard */}
              {previewProject.keyMetrics && previewProject.keyMetrics.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Performance Metrics</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {previewProject.keyMetrics.map((metric, idx) => (
                      <div key={idx} className="bg-[#0A1020]/80 border border-slate-900 rounded-xl p-4 text-center hover:border-[#00E5FF]/20 transition-colors">
                        <span className="block text-2xl md:text-3xl font-display font-extrabold bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] bg-clip-text text-transparent">
                          {metric.value}
                        </span>
                        <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1.5">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Case Study Sections */}
              {(previewProject.problemStatement || previewProject.solution || previewProject.challenges || previewProject.outcomes) && (
                <div className="space-y-4">
                  <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2">Case Study Deep Dive</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {previewProject.problemStatement && (
                      <div className="space-y-1 bg-[#090F1E]/30 p-4 rounded-xl border border-slate-900/60">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Problem Statement</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{previewProject.problemStatement}</p>
                      </div>
                    )}
                    {previewProject.solution && (
                      <div className="space-y-1 bg-[#090F1E]/30 p-4 rounded-xl border border-slate-900/60">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Product Solution</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{previewProject.solution}</p>
                      </div>
                    )}
                    {previewProject.challenges && (
                      <div className="space-y-1 bg-[#090F1E]/30 p-4 rounded-xl border border-slate-900/60">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Technical Challenges</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{previewProject.challenges}</p>
                      </div>
                    )}
                    {previewProject.outcomes && (
                      <div className="space-y-1 bg-[#090F1E]/30 p-4 rounded-xl border border-slate-900/60">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Measurable Outcomes</span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{previewProject.outcomes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Highlights List */}
              {previewProject.highlights && previewProject.highlights.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Key Accomplishments</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                    {previewProject.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-[#090F1E]/20 p-2.5 rounded-lg border border-slate-950">
                        <span className="text-[#00E5FF] font-mono shrink-0 select-none">✔</span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Screenshot Gallery */}
              {previewProject.gallery && previewProject.gallery.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Screenshot Gallery</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {previewProject.gallery.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 rounded-xl overflow-hidden border border-slate-900 group relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.alt || `Gallery image ${idx + 1}`}
                            className="w-full h-44 object-cover"
                          />
                        ) : null}
                        {item.alt && (
                          <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs p-2 text-[10px] text-slate-400 border-t border-slate-900">
                            {item.alt}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Architecture Diagram */}
              {previewProject.architectureDiagram && (
                <div className="space-y-3">
                  <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Architecture Diagram</h4>
                  <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 p-4 flex justify-center">
                    <img
                      src={previewProject.architectureDiagram}
                      alt="System Architecture Diagram"
                      className="max-h-72 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Tech Stack Chips */}
              {previewProject.techStack && previewProject.techStack.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewProject.techStack.map((tech, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono text-[10px] uppercase">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Tags */}
              {previewProject.tags && previewProject.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Project tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {previewProject.tags.map((tag, idx) => (
                      <span key={idx} className="bg-slate-950 border border-slate-900 text-slate-500 px-2 py-0.5 rounded text-[9px] font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal CTA Action Bar */}
            <div className="bg-[#050814] border-t border-slate-900 p-5 flex flex-wrap gap-3 items-center justify-end">
              {previewProject.githubUrl && previewProject.showGithub !== false && (
                <a
                  href={previewProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent border border-slate-800 hover:border-[#00E5FF] hover:text-[#00E5FF] text-slate-300 font-mono text-xs uppercase py-2 px-4 rounded-lg tracking-wider transition-all"
                >
                  GitHub Code
                </a>
              )}
              {previewProject.demoUrl && previewProject.showDemo !== false && (
                <a
                  href={previewProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:opacity-90 text-white font-mono text-xs uppercase py-2.5 px-5 rounded-lg tracking-wider transition-all shadow-md"
                >
                  Live Demo
                </a>
              )}
              {previewProject.documentationUrl && previewProject.showDocumentation !== false && (
                <a
                  href={previewProject.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent border border-slate-800 hover:border-slate-400 text-slate-300 font-mono text-xs uppercase py-2 px-4 rounded-lg tracking-wider transition-all"
                >
                  Docs
                </a>
              )}
              {previewProject.videoDemoUrl && previewProject.showVideoDemo !== false && (
                <a
                  href={previewProject.videoDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent border border-slate-800 hover:border-[#FF4FD8] hover:text-[#FF4FD8] text-slate-300 font-mono text-xs uppercase py-2 px-4 rounded-lg tracking-wider transition-all"
                >
                  Watch Video
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
