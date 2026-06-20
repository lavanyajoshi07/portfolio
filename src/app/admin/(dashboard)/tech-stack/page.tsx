'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings as SettingsIcon, 
  FolderTree, 
  Cpu, 
  BarChart, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/hooks/useToast'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'

import { 
  techStackSettingsSchema, 
  technologyCategorySchema, 
  technologySchema, 
  techStatsSchema 
} from '@/lib/validation'

import {
  TechStackSettings,
  TechnologyCategory,
  Technology,
  TechStats
} from '@/types'

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export default function TechStackAdminPage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'categories' | 'technologies' | 'stats'>('settings')
  const [settings, setSettings] = useState<TechStackSettings | null>(null)
  const [categories, setCategories] = useState<TechnologyCategory[]>([])
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [stats, setStats] = useState<TechStats[]>([])
  
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  // Modal triggers
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<TechnologyCategory | null>(null)
  
  const [techModalOpen, setTechModalOpen] = useState(false)
  const [editingTech, setEditingTech] = useState<Technology | null>(null)
  
  const [statModalOpen, setStatModalOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<TechStats | null>(null)

  // Soft delete targets
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'technology' | 'stat', id: string } | null>(null)

  // Form setups
  const settingsForm = useForm<TechStackSettings>({
    resolver: zodResolver(techStackSettingsSchema),
    defaultValues: {
      badgeText: 'Tech Stack',
      title: 'Technologies & Tools',
      subtitle: '',
      quote: '',
      categoriesEnabled: true,
      statsEnabled: true,
      quoteEnabled: true,
      animationsEnabled: true,
    }
  })

  const categoryForm = useForm<any>({
    resolver: zodResolver(technologyCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      order: 0,
      active: true,
    }
  })

  const techForm = useForm<any>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: '',
      iconType: 'library',
      icon: '',
      categoryId: '',
      proficiency: 80,
      experience: '',
      description: '',
      color: '',
      displayOrder: 0,
      active: true,
      featured: false,
    }
  })

  const statForm = useForm<any>({
    resolver: zodResolver(techStatsSchema),
    defaultValues: {
      iconType: 'library',
      icon: '',
      value: '',
      label: '',
      order: 0,
      active: true,
    }
  })

  // Watch for auto-slugify
  const catNameVal = categoryForm.watch('name')
  useEffect(() => {
    if (!editingCategory && catNameVal) {
      categoryForm.setValue('slug', slugify(catNameVal))
    }
  }, [catNameVal, editingCategory, categoryForm])

  // Fetch functions
  const fetchData = async () => {
    setLoading(true)
    try {
      const [settingsRes, catRes, techRes, statRes] = await Promise.all([
        fetch('/api/tech-stack-settings').then(r => r.json()),
        fetch('/api/technology-categories').then(r => r.json()),
        fetch('/api/technologies').then(r => r.json()),
        fetch('/api/tech-stats').then(r => r.json()),
      ])

      if (settingsRes.success && settingsRes.data) {
        setSettings(settingsRes.data)
        settingsForm.reset(settingsRes.data)
      }
      if (catRes.success) setCategories(catRes.data)
      if (techRes.success) setTechnologies(techRes.data)
      if (statRes.success) setStats(statRes.data)

    } catch (error) {
      console.error(error)
      toast({
        title: 'Fetch Error',
        description: 'Failed to retrieve CMS content.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 1. Settings submit
  const onSettingsSubmit = async (data: TechStackSettings) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/tech-stack-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: 'Tech Stack settings updated.' })
        setSettings(result.data)
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to update settings.', variant: 'destructive' })
      }
    } catch (e) {
      console.error(e)
      toast({ title: 'Connection Error', description: 'Failed to send settings payload.', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  // 2. Categories CRUD
  const handleOpenCreateCategory = () => {
    setEditingCategory(null)
    categoryForm.reset({
      name: '',
      slug: '',
      order: categories.length + 1,
      active: true
    })
    setCategoryModalOpen(true)
  }

  const handleOpenEditCategory = (cat: TechnologyCategory) => {
    setEditingCategory(cat)
    categoryForm.reset({
      name: cat.name,
      slug: cat.slug,
      order: cat.order,
      active: cat.active
    })
    setCategoryModalOpen(true)
  }

  const onCategorySubmit = async (data: any) => {
    setActionLoading(true)
    const url = editingCategory ? `/api/technology-categories/${editingCategory._id}` : '/api/technology-categories'
    const method = editingCategory ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: `Category ${editingCategory ? 'updated' : 'created'} successfully.` })
        setCategoryModalOpen(false)
        fetchData()
      } else {
        toast({ title: 'Error', description: result.error || 'Operation failed', variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'Error', description: 'API dispatch error', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  // 3. Technologies CRUD
  const handleOpenCreateTech = () => {
    setEditingTech(null)
    techForm.reset({
      name: '',
      iconType: 'library',
      icon: '',
      categoryId: categories[0]?._id || '',
      proficiency: 80,
      experience: '',
      description: '',
      color: '',
      displayOrder: technologies.length + 1,
      active: true,
      featured: false
    })
    setTechModalOpen(true)
  }

  const handleOpenEditTech = (tech: Technology) => {
    setEditingTech(tech)
    techForm.reset({
      name: tech.name,
      iconType: tech.iconType || 'library',
      icon: tech.icon,
      categoryId: tech.categoryId,
      proficiency: tech.proficiency,
      experience: tech.experience || '',
      description: tech.description || '',
      color: tech.color || '',
      displayOrder: tech.displayOrder,
      active: tech.active,
      featured: tech.featured || false
    })
    setTechModalOpen(true)
  }

  const onTechSubmit = async (data: any) => {
    setActionLoading(true)
    const url = editingTech ? `/api/technologies/${editingTech._id}` : '/api/technologies'
    const method = editingTech ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: `Technology ${editingTech ? 'updated' : 'created'} successfully.` })
        setTechModalOpen(false)
        fetchData()
      } else {
        toast({ title: 'Error', description: result.error || 'Operation failed', variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'Error', description: 'API dispatch error', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  // 4. Stats CRUD
  const handleOpenCreateStat = () => {
    setEditingStat(null)
    statForm.reset({
      iconType: 'library',
      icon: '',
      value: '',
      label: '',
      order: stats.length + 1,
      active: true
    })
    setStatModalOpen(true)
  }

  const handleOpenEditStat = (st: TechStats) => {
    setEditingStat(st)
    statForm.reset({
      iconType: st.iconType || 'library',
      icon: st.icon || '',
      value: st.value,
      label: st.label,
      order: st.order,
      active: st.active
    })
    setStatModalOpen(true)
  }

  const onStatSubmit = async (data: any) => {
    setActionLoading(true)
    const url = editingStat ? `/api/tech-stats/${editingStat._id}` : '/api/tech-stats'
    const method = editingStat ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: `Stat card ${editingStat ? 'updated' : 'created'} successfully.` })
        setStatModalOpen(false)
        fetchData()
      } else {
        toast({ title: 'Error', description: result.error || 'Operation failed', variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'Error', description: 'API dispatch error', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  // Universal Soft Delete handler
  const handleConfirmSoftDelete = async () => {
    if (!deleteTarget) return
    setActionLoading(true)
    let url = ''
    if (deleteTarget.type === 'category') url = `/api/technology-categories/${deleteTarget.id}`
    else if (deleteTarget.type === 'technology') url = `/api/technologies/${deleteTarget.id}`
    else if (deleteTarget.type === 'stat') url = `/api/tech-stats/${deleteTarget.id}`

    try {
      const res = await fetch(url, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: `${deleteTarget.type.toUpperCase()} soft-deleted successfully.` })
        setDeleteTarget(null)
        fetchData()
      } else {
        toast({ title: 'Error', description: result.error || 'Soft deletion failed.', variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Network deletion timeout', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  // Order sorting buttons handler (Up/Down)
  const handleSwapOrder = async (type: 'category' | 'technology' | 'stat', index: number, direction: 'up' | 'down') => {
    const list = type === 'category' ? [...categories] : type === 'technology' ? [...technologies] : [...stats]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= list.length) return

    setActionLoading(true)
    const itemA = list[index]
    const itemB = list[targetIndex]

    // Swap orders
    const key = type === 'technology' ? 'displayOrder' : 'order'
    const orderA = (itemA as any)[key]
    const orderB = (itemB as any)[key]

    let urlA = '', urlB = ''
    if (type === 'category') {
      urlA = `/api/technology-categories/${itemA._id}`
      urlB = `/api/technology-categories/${itemB._id}`
    } else if (type === 'technology') {
      urlA = `/api/technologies/${itemA._id}`
      urlB = `/api/technologies/${itemB._id}`
    } else if (type === 'stat') {
      urlA = `/api/tech-stats/${itemA._id}`
      urlB = `/api/tech-stats/${itemB._id}`
    }

    try {
      await Promise.all([
        fetch(urlA, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...itemA, [key]: orderB })
        }),
        fetch(urlB, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...itemB, [key]: orderA })
        })
      ])
      toast({ title: 'Reordered', description: 'Display priority synced.' })
      fetchData()
    } catch (e) {
      toast({ title: 'Reorder error', description: 'Failed to sync drag sequence', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  const categoryMap = new Map(categories.map(c => [c._id, c.name]))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Tech Stack CMS
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Maintain setting parameters, category pills, tools, and stack statistics
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={fetchData}
          disabled={loading}
          className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
        >
          <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-900 font-mono text-xs uppercase tracking-wider overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
            activeTab === 'settings' 
              ? 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          Section Settings
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
            activeTab === 'categories' 
              ? 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          Categories
        </button>
        <button
          onClick={() => setActiveTab('technologies')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
            activeTab === 'technologies' 
              ? 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Technologies
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
            activeTab === 'stats' 
              ? 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BarChart className="w-4 h-4" />
          Stats Cards
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-[#00E5FF] animate-spin" />
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Accessing records...</p>
        </div>
      )}

      {/* Tabs content */}
      {!loading && (
        <div className="space-y-6">
          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-[#0A1020]/40 border border-slate-900 rounded-xl p-6 max-w-2xl">
              <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider border-b border-slate-900 pb-3 mb-5">
                Configure Stack Section
              </h2>
              <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Badge Label</Label>
                    <Input {...settingsForm.register('badgeText')} className="bg-[#101827]/70 border-slate-800 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Section Title</Label>
                    <Input {...settingsForm.register('title')} className="bg-[#101827]/70 border-slate-800 text-white" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-mono text-[10px] text-slate-500 uppercase">Section Subtitle</Label>
                  <Textarea {...settingsForm.register('subtitle')} rows={3} className="bg-[#101827]/70 border-slate-800 text-white" />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-mono text-[10px] text-slate-500 uppercase">Quote Block Content</Label>
                  <Textarea {...settingsForm.register('quote')} rows={2} className="bg-[#101827]/70 border-slate-800 text-white" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-900 pt-5">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settingsForm.watch('categoriesEnabled')}
                      onCheckedChange={(checked) => settingsForm.setValue('categoriesEnabled', checked)}
                    />
                    <div>
                      <Label className="font-mono text-[9px] text-slate-400 uppercase">Categories</Label>
                      <p className="text-[8px] font-mono text-slate-500 uppercase">Pills tabs</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settingsForm.watch('statsEnabled')}
                      onCheckedChange={(checked) => settingsForm.setValue('statsEnabled', checked)}
                    />
                    <div>
                      <Label className="font-mono text-[9px] text-slate-400 uppercase">Statistics</Label>
                      <p className="text-[8px] font-mono text-slate-500 uppercase">Stats row</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settingsForm.watch('quoteEnabled')}
                      onCheckedChange={(checked) => settingsForm.setValue('quoteEnabled', checked)}
                    />
                    <div>
                      <Label className="font-mono text-[9px] text-slate-400 uppercase">Quote block</Label>
                      <p className="text-[8px] font-mono text-slate-500 uppercase">Bottom quotes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settingsForm.watch('animationsEnabled')}
                      onCheckedChange={(checked) => settingsForm.setValue('animationsEnabled', checked)}
                    />
                    <div>
                      <Label className="font-mono text-[9px] text-slate-400 uppercase">Animations</Label>
                      <p className="text-[8px] font-mono text-slate-500 uppercase">Framer Motion</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-900">
                  <Button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
                  >
                    {actionLoading ? 'Updating...' : 'Save Settings'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-mono text-slate-400 uppercase">Manage filter tabs</p>
                <Button
                  onClick={handleOpenCreateCategory}
                  className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase py-4 px-5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>

              <DataTable
                data={categories}
                searchKey="name"
                searchPlaceholder="Search categories..."
                loading={false}
                columns={[
                  {
                    header: 'Name',
                    accessor: (item: TechnologyCategory) => (
                      <span className="font-bold text-slate-200">{item.name}</span>
                    )
                  },
                  {
                    header: 'Slug',
                    accessor: (item: TechnologyCategory) => (
                      <span className="font-mono text-slate-400 text-xs">{item.slug}</span>
                    )
                  },
                  {
                    header: 'Status',
                    accessor: (item: TechnologyCategory) => (
                      <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full ${
                        item.active 
                          ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30' 
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        {item.active ? 'Active' : 'Disabled'}
                      </span>
                    )
                  },
                  {
                    header: 'Order Priority',
                    accessor: (item: TechnologyCategory, idx?: number) => (
                      <div className="flex items-center gap-2 font-mono text-slate-400 text-xs">
                        <span>{item.order}</span>
                        {typeof idx === 'number' && (
                          <div className="flex gap-1">
                            <button
                              disabled={idx === 0 || actionLoading}
                              onClick={() => handleSwapOrder('category', idx, 'up')}
                              className="p-1 hover:text-white hover:bg-slate-900 rounded disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === categories.length - 1 || actionLoading}
                              onClick={() => handleSwapOrder('category', idx, 'down')}
                              className="p-1 hover:text-white hover:bg-slate-900 rounded disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  }
                ]}
                actions={(item: TechnologyCategory) => (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditCategory(item)}
                      className="border-slate-800 hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 text-slate-400 hover:text-white"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget({ type: 'category', id: item._id! })}
                      className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              />
            </div>
          )}

          {/* TAB 3: TECHNOLOGIES */}
          {activeTab === 'technologies' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-mono text-slate-400 uppercase">Manage stack grid items</p>
                <Button
                  onClick={handleOpenCreateTech}
                  className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase py-4 px-5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Technology
                </Button>
              </div>

              <DataTable
                data={technologies}
                searchKey="name"
                searchPlaceholder="Search technologies..."
                loading={false}
                columns={[
                  {
                    header: 'Name',
                    accessor: (item: Technology) => (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#101827] border border-slate-800 flex items-center justify-center overflow-hidden">
                          {item.iconType === 'upload' ? (
                            <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain" />
                          ) : (
                            <span className="font-mono text-[9px] text-[#00E5FF] font-bold uppercase">{item.icon.substring(0,3)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{item.name}</p>
                          <span className="text-[10px] font-mono text-slate-500">
                            {item.iconType === 'upload' ? 'Upload Icon' : `Library: ${item.icon}`}
                          </span>
                        </div>
                      </div>
                    )
                  },
                  {
                    header: 'Category',
                    accessor: (item: Technology) => (
                      <span className="text-xs text-slate-300 font-semibold bg-[#101827] border border-slate-900 rounded-md px-2 py-1">
                        {categoryMap.get(item.categoryId) || 'Unknown Category'}
                      </span>
                    )
                  },
                  {
                    header: 'Proficiency',
                    accessor: (item: Technology) => (
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-[#00E5FF]">{item.proficiency}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                          <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#7C3AED]" style={{ width: `${item.proficiency}%` }} />
                        </div>
                      </div>
                    )
                  },
                  {
                    header: 'Featured',
                    accessor: (item: Technology) => (
                      <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full ${
                        item.featured 
                          ? 'bg-[#FF4FD8]/15 text-[#FF4FD8] border border-[#FF4FD8]/30' 
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        {item.featured ? 'Featured' : 'Standard'}
                      </span>
                    )
                  },
                  {
                    header: 'Active',
                    accessor: (item: Technology) => (
                      <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full ${
                        item.active 
                          ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30' 
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        {item.active ? 'Active' : 'Hidden'}
                      </span>
                    )
                  },
                  {
                    header: 'Order Priority',
                    accessor: (item: Technology, idx?: number) => (
                      <div className="flex items-center gap-2 font-mono text-slate-400 text-xs">
                        <span>{item.displayOrder}</span>
                        {typeof idx === 'number' && (
                          <div className="flex gap-1">
                            <button
                              disabled={idx === 0 || actionLoading}
                              onClick={() => handleSwapOrder('technology', idx, 'up')}
                              className="p-1 hover:text-white hover:bg-slate-900 rounded disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === technologies.length - 1 || actionLoading}
                              onClick={() => handleSwapOrder('technology', idx, 'down')}
                              className="p-1 hover:text-white hover:bg-slate-900 rounded disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  }
                ]}
                actions={(item: Technology) => (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditTech(item)}
                      className="border-slate-800 hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 text-slate-400 hover:text-white"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget({ type: 'technology', id: item._id! })}
                      className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              />
            </div>
          )}

          {/* TAB 4: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-mono text-slate-400 uppercase">Manage bottom statistics row</p>
                <Button
                  disabled={stats.length >= 5}
                  onClick={handleOpenCreateStat}
                  className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase py-4 px-5 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stat Card
                </Button>
              </div>

              <DataTable
                data={stats}
                searchKey="label"
                searchPlaceholder="Search stats..."
                loading={false}
                columns={[
                  {
                    header: 'Stat Label',
                    accessor: (item: TechStats) => (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#101827] border border-slate-800 flex items-center justify-center overflow-hidden">
                          {item.iconType === 'upload' ? (
                            <img src={item.icon} alt={item.label} className="w-5 h-5 object-contain" />
                          ) : (
                            <span className="font-mono text-xs text-[#00E5FF] uppercase font-bold">{item.icon?.substring(0,3)}</span>
                          )}
                        </div>
                        <span className="font-bold text-slate-200">{item.label}</span>
                      </div>
                    )
                  },
                  {
                    header: 'Display Value',
                    accessor: (item: TechStats) => (
                      <span className="font-display font-bold text-md text-[#00E5FF] bg-[#00E5FF]/5 border border-[#00E5FF]/10 px-2 py-0.5 rounded">
                        {item.value}
                      </span>
                    )
                  },
                  {
                    header: 'Status',
                    accessor: (item: TechStats) => (
                      <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full ${
                        item.active 
                          ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30' 
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        {item.active ? 'Active' : 'Hidden'}
                      </span>
                    )
                  },
                  {
                    header: 'Order Priority',
                    accessor: (item: TechStats, idx?: number) => (
                      <div className="flex items-center gap-2 font-mono text-slate-400 text-xs">
                        <span>{item.order}</span>
                        {typeof idx === 'number' && (
                          <div className="flex gap-1">
                            <button
                              disabled={idx === 0 || actionLoading}
                              onClick={() => handleSwapOrder('stat', idx, 'up')}
                              className="p-1 hover:text-white hover:bg-slate-900 rounded disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === stats.length - 1 || actionLoading}
                              onClick={() => handleSwapOrder('stat', idx, 'down')}
                              className="p-1 hover:text-white hover:bg-slate-900 rounded disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  }
                ]}
                actions={(item: TechStats) => (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditStat(item)}
                      className="border-slate-800 hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 text-slate-400 hover:text-white"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget({ type: 'stat', id: item._id! })}
                      className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      )}

      {/* DIALOGS */}

      {/* 1. Category Modal */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingCategory ? 'Modify Category' : 'Create Category'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Category Name</Label>
              <Input
                {...categoryForm.register('name')}
                placeholder="e.g. Frontend"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {categoryForm.formState.errors.name && (
                <p className="text-xs text-red-500 font-mono">{categoryForm.formState.errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Slug Filter Tag (Auto-generated)</Label>
              <Input
                {...categoryForm.register('slug')}
                placeholder="e.g. frontend"
                className="bg-[#101827]/70 border-slate-800 text-white font-mono"
              />
              {categoryForm.formState.errors.slug && (
                <p className="text-xs text-red-500 font-mono">{categoryForm.formState.errors.slug.message as string}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Display Order</Label>
                <Input
                  type="number"
                  {...categoryForm.register('order', { valueAsNumber: true })}
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Switch
                  checked={categoryForm.watch('active')}
                  onCheckedChange={(checked) => categoryForm.setValue('active', checked)}
                />
                <div>
                  <Label className="font-mono text-[10px] text-slate-300 uppercase">Active</Label>
                  <p className="text-[8px] font-mono text-slate-500 uppercase">Filter pill visible</p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-900 font-mono text-xs uppercase tracking-wider">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCategoryModalOpen(false)}
                className="border-slate-800 bg-transparent text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white"
              >
                {actionLoading ? 'Saving...' : 'Deploy Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Technology Modal */}
      <Dialog open={techModalOpen} onOpenChange={setTechModalOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-lg backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingTech ? 'Modify Technology Node' : 'Deploy Technology Node'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={techForm.handleSubmit(onTechSubmit)} className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Technology Name</Label>
                <Input
                  {...techForm.register('name')}
                  placeholder="e.g. LangChain"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
                {techForm.formState.errors.name && (
                  <p className="text-xs text-red-500 font-mono">{techForm.formState.errors.name.message as string}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Category Parent</Label>
                <select
                  {...techForm.register('categoryId')}
                  className="w-full bg-[#101827] border border-slate-800 text-slate-200 rounded-md p-2 text-sm focus:border-[#00E5FF] outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                {techForm.formState.errors.categoryId && (
                  <p className="text-xs text-red-500 font-mono">{techForm.formState.errors.categoryId.message as string}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Icon Type</Label>
                <select
                  {...techForm.register('iconType')}
                  className="w-full bg-[#101827] border border-slate-800 text-slate-200 rounded-md p-2 text-sm focus:border-[#00E5FF] outline-none"
                >
                  <option value="library">Library string registry</option>
                  <option value="upload">Public asset path (/uploads/...)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Icon Name or Path</Label>
                <Input
                  {...techForm.register('icon')}
                  placeholder="e.g. python OR /placeholders/logo.svg"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
                {techForm.formState.errors.icon && (
                  <p className="text-xs text-red-500 font-mono">{techForm.formState.errors.icon.message as string}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Proficiency %</Label>
                <Input
                  type="number"
                  {...techForm.register('proficiency', { valueAsNumber: true })}
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Experience Label</Label>
                <Input
                  {...techForm.register('experience')}
                  placeholder="e.g. 2 Years"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Accent Color Hex</Label>
                <Input
                  {...techForm.register('color')}
                  placeholder="e.g. #3776AB"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Brief Description</Label>
              <Textarea
                {...techForm.register('description')}
                placeholder="Describe how you work with this technology..."
                rows={2}
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 items-center border-t border-slate-900 pt-3">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Display Order</Label>
                <Input
                  type="number"
                  {...techForm.register('displayOrder', { valueAsNumber: true })}
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Switch
                  checked={techForm.watch('active')}
                  onCheckedChange={(checked) => techForm.setValue('active', checked)}
                />
                <div>
                  <Label className="font-mono text-[9px] text-slate-300 uppercase">Active</Label>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Switch
                  checked={techForm.watch('featured')}
                  onCheckedChange={(checked) => techForm.setValue('featured', checked)}
                />
                <div>
                  <Label className="font-mono text-[9px] text-slate-300 uppercase">Featured</Label>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-900 font-mono text-xs uppercase tracking-wider">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTechModalOpen(false)}
                className="border-slate-800 bg-transparent text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white"
              >
                {actionLoading ? 'Saving...' : 'Deploy Node'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 3. Stat Card Modal */}
      <Dialog open={statModalOpen} onOpenChange={setStatModalOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingStat ? 'Modify Stat Card' : 'Add Stat Card'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={statForm.handleSubmit(onStatSubmit)} className="space-y-4 py-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Stat Value</Label>
                <Input
                  {...statForm.register('value')}
                  placeholder="e.g. 20+"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
                {statForm.formState.errors.value && (
                  <p className="text-xs text-red-500 font-mono">{statForm.formState.errors.value.message as string}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Stat Label</Label>
                <Input
                  {...statForm.register('label')}
                  placeholder="e.g. Technologies"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
                {statForm.formState.errors.label && (
                  <p className="text-xs text-red-500 font-mono">{statForm.formState.errors.label.message as string}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Icon Type</Label>
                <select
                  {...statForm.register('iconType')}
                  className="w-full bg-[#101827] border border-slate-800 text-slate-200 rounded-md p-2 text-sm focus:border-[#00E5FF] outline-none"
                >
                  <option value="library">Library string registry</option>
                  <option value="upload">Public asset path (/uploads/...)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Icon</Label>
                <Input
                  {...statForm.register('icon')}
                  placeholder="e.g. code OR /uploads/icon.png"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Display Order</Label>
                <Input
                  type="number"
                  {...statForm.register('order', { valueAsNumber: true })}
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Switch
                  checked={statForm.watch('active')}
                  onCheckedChange={(checked) => statForm.setValue('active', checked)}
                />
                <div>
                  <Label className="font-mono text-[10px] text-slate-300 uppercase">Active</Label>
                  <p className="text-[8px] font-mono text-slate-500 uppercase">Visible on front</p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-900 font-mono text-xs uppercase tracking-wider">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStatModalOpen(false)}
                className="border-slate-800 bg-transparent text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white"
              >
                {actionLoading ? 'Saving...' : 'Deploy Stat'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmSoftDelete}
        loading={actionLoading}
        title={`Soft Delete ${deleteTarget?.type.toUpperCase()}`}
        description={`Are you sure you want to delete this ${deleteTarget?.type}? It will be hidden from the portfolio, but retained in the system for recovery purposes.`}
        confirmText="Yes, Soft Delete"
      />
    </div>
  )
}
