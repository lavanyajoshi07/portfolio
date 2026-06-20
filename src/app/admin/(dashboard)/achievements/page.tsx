'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  achievementSchema, 
  achievementCategorySchema, 
  achievementSettingsSchema 
} from '@/lib/validation'
import { 
  Plus, Edit, Trash2, Trophy, RefreshCw, Calendar, Copy, 
  Settings as SettingsIcon, Image as ImageIcon, Link as LinkIcon, 
  Check, ArrowUp, ArrowDown, Move, Eye, FolderPlus, EyeOff, AlertTriangle, Archive, Trash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import { Achievement, AchievementCategory, AchievementSettings } from '@/types'

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [categories, setCategories] = useState<AchievementCategory[]>([])
  const [deletedAchievements, setDeletedAchievements] = useState<Achievement[]>([])
  const [deletedCategories, setDeletedCategories] = useState<AchievementCategory[]>([])
  const [settings, setSettings] = useState<AchievementSettings | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('achievements')
  const { toast } = useToast()

  // Form triggers
  const [achievementModalOpen, setAchievementModalOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AchievementCategory | null>(null)

  // Hard delete targets
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<{
    type: 'achievement' | 'category'
    id: string
    permanent: boolean
  } | null>(null)

  // Category deletion cascade/move dialog state
  const [associatedAchievementsModalOpen, setAssociatedAchievementsModalOpen] = useState(false)
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(null)
  const [associatedAchievementsCount, setAssociatedAchievementsCount] = useState(0)
  const [deleteMode, setDeleteMode] = useState<'move' | 'cascade'>('move')
  const [targetCategoryId, setTargetCategoryId] = useState('')

  // Upload flags
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  // Tag helper
  const [tagInput, setTagInput] = useState('')

  // 1. Achievements Form
  const achForm = useForm<any>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: '',
      organization: '',
      description: '',
      date: '',
      year: '',
      category: '',
      icon: '',
      badgeColor: '',
      showInCategory: true,
      displayOrder: 0,
      achievementImage: '',
      achievementUrl: '',
      tags: [],
      metricValue: '',
      metricLabel: '',
    }
  })

  // 2. Categories Form
  const catForm = useForm<any>({
    resolver: zodResolver(achievementCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      icon: '',
      color: '',
      description: '',
      coverImage: '',
      displayOrder: 0,
      active: true,
    }
  })

  // 3. Settings Form
  const settingsForm = useForm<any>({
    resolver: zodResolver(achievementSettingsSchema),
    defaultValues: {
      title: 'ACHIEVEMENTS & AWARDS',
      subtitle: 'Recognitions, competitions, memberships, and engineering milestones.',
      showCategoryGrid: true,
      animationsEnabled: true,
    }
  })

  // Watches
  const achImageVal = achForm.watch('achievementImage')
  const achTagsVal = achForm.watch('tags') || []
  const catCoverImageVal = catForm.watch('coverImage')
  const catNameVal = catForm.watch('name')

  // Auto-generate Category slug from name
  useEffect(() => {
    if (!editingCategory && catNameVal) {
      catForm.setValue('slug', catNameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
    }
  }, [catNameVal, editingCategory, catForm])

  // Fetch lists
  const fetchData = async () => {
    setLoading(true)
    try {
      const [achRes, catRes, settingsRes, delAchRes, delCatRes] = await Promise.all([
        fetch('/api/achievements').then(r => r.json()),
        fetch('/api/achievement-categories').then(r => r.json()),
        fetch('/api/achievement-settings').then(r => r.json()),
        fetch('/api/achievements?trash=true').then(r => r.json()),
        fetch('/api/achievement-categories?trash=true').then(r => r.json()),
      ])

      if (achRes.success) setAchievements(achRes.data)
      if (catRes.success) setCategories(catRes.data)
      if (settingsRes.success && settingsRes.data) {
        setSettings(settingsRes.data)
        settingsForm.reset(settingsRes.data)
      }
      if (delAchRes.success) setDeletedAchievements(delAchRes.data)
      if (delCatRes.success) setDeletedCategories(delCatRes.data)

    } catch (error) {
      console.error(error)
      toast({
        title: 'Fetch Error',
        description: 'Failed to retrieve achievements data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Image Upload handler helper
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'achievementImage' | 'coverImage') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Upload Rejected',
        description: 'Image size exceeds maximum limit of 10 MB.',
        variant: 'destructive',
      })
      return
    }

    if (fieldName === 'achievementImage') setUploadingImage(true)
    else setUploadingCover(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      if (result.success && result.data?.url) {
        if (fieldName === 'achievementImage') {
          achForm.setValue('achievementImage', result.data.url, { shouldDirty: true })
        } else {
          catForm.setValue('coverImage', result.data.url, { shouldDirty: true })
        }
        toast({
          title: 'Upload Successful',
          description: 'Image attached to the record.',
        })
      } else {
        toast({
          title: 'Upload Failed',
          description: result.error || 'Failed to upload image.',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to upload files.',
        variant: 'destructive',
      })
    } finally {
      setUploadingImage(false)
      setUploadingCover(false)
    }
  }

  // Tags chip handling
  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (!trimmed) return
    if (achTagsVal.includes(trimmed)) {
      setTagInput('')
      return
    }
    const updated = [...achTagsVal, trimmed]
    achForm.setValue('tags', updated, { shouldDirty: true })
    setTagInput('')
  }

  const handleRemoveTag = (tag: string) => {
    const updated = achTagsVal.filter((t: string) => t !== tag)
    achForm.setValue('tags', updated, { shouldDirty: true })
  }

  // --- TAB 1: ACHIEVEMENTS CRUD ---
  const handleOpenCreateAchievement = () => {
    setEditingAchievement(null)
    setTagInput('')
    achForm.reset({
      title: '',
      organization: '',
      description: '',
      date: '',
      year: '',
      category: categories[0]?._id || '',
      icon: '🏆',
      badgeColor: '#00E5FF',
      showInCategory: true,
      displayOrder: achievements.length,
      achievementImage: '',
      achievementUrl: '',
      tags: [],
      metricValue: '',
      metricLabel: '',
    })
    setAchievementModalOpen(true)
  }

  const handleOpenEditAchievement = (item: Achievement) => {
    setEditingAchievement(item)
    setTagInput('')
    achForm.reset({
      title: item.title,
      organization: item.organization || '',
      description: item.description || '',
      date: item.date,
      year: item.year,
      category: (typeof item.category === 'string' ? item.category : item.category?._id) || '',
      icon: item.icon || '🏆',
      badgeColor: item.badgeColor || '#00E5FF',
      showInCategory: item.showInCategory ?? true,
      displayOrder: item.displayOrder || 0,
      achievementImage: item.achievementImage || '',
      achievementUrl: item.achievementUrl || '',
      tags: item.tags || [],
      metricValue: item.metricValue || '',
      metricLabel: item.metricLabel || '',
    })
    setAchievementModalOpen(true)
  }

  const handleDuplicateAchievement = async (item: Achievement) => {
    setActionLoading(true)
    const categoryId = (typeof item.category === 'string' ? item.category : item.category?._id) || ''
    const duplicateData = {
      title: `${item.title} (Copy)`,
      organization: item.organization || '',
      description: item.description || '',
      date: item.date,
      year: item.year,
      category: categoryId,
      icon: item.icon || '🏆',
      badgeColor: item.badgeColor || '#00E5FF',
      showInCategory: item.showInCategory ?? true,
      displayOrder: achievements.length,
      achievementImage: item.achievementImage || '',
      achievementUrl: item.achievementUrl || '',
      tags: item.tags || [],
      metricValue: item.metricValue || '',
      metricLabel: item.metricLabel || '',
    }

    try {
      const res = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Duplicated', description: 'Duplicated record created.' })
        fetchData()
      } else {
        toast({ title: 'Error', description: result.error || 'Duplication failed', variant: 'destructive' })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  const onAchievementSubmit = async (data: any) => {
    setActionLoading(true)
    const url = editingAchievement ? `/api/achievements/${editingAchievement._id}` : '/api/achievements'
    const method = editingAchievement ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (result.success) {
        toast({
          title: 'Success',
          description: `Achievement ${editingAchievement ? 'modified' : 'registered'} successfully.`
        })
        setAchievementModalOpen(false)
        fetchData()
      } else {
        toast({ title: 'Error', description: result.error || 'Process failed.', variant: 'destructive' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  // Soft deleting item
  const handleSoftDelete = async (type: 'achievement' | 'category', id: string) => {
    setActionLoading(true)
    const url = type === 'achievement' ? `/api/achievements/${id}` : `/api/achievement-categories/${id}`
    try {
      const res = await fetch(url, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: `${type} soft-deleted. Moved to trash.` })
        fetchData()
      } else if (result.code === 'ASSOCIATED_ACHIEVEMENTS_EXIST') {
        // Associated achievements block detected
        setCategoryToDeleteId(id)
        setAssociatedAchievementsCount(result.count)
        setDeleteMode('move')
        const activeOtherCats = categories.filter(c => c._id !== id)
        setTargetCategoryId(activeOtherCats[0]?._id || '')
        setAssociatedAchievementsModalOpen(true)
      } else {
        toast({ title: 'Error', description: result.error || 'Operation failed', variant: 'destructive' })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  // Deleting category containing achievements
  const handleResolveCategoryDeletion = async () => {
    if (!categoryToDeleteId) return
    setActionLoading(true)
    const url = `/api/achievement-categories/${categoryToDeleteId}?mode=${deleteMode}${deleteMode === 'move' ? `&targetId=${targetCategoryId}` : ''}`
    try {
      const res = await fetch(url, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: 'Category and achievements deleted/migrated.' })
        setAssociatedAchievementsModalOpen(false)
        setCategoryToDeleteId(null)
        fetchData()
      } else {
        toast({ title: 'Error', description: result.error || 'Operation failed.', variant: 'destructive' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  // --- TAB 2: CATEGORIES CRUD ---
  const handleOpenCreateCategory = () => {
    setEditingCategory(null)
    catForm.reset({
      name: '',
      slug: '',
      icon: '🏆',
      color: '#00E5FF',
      description: '',
      coverImage: '',
      displayOrder: categories.length,
      active: true,
    })
    setCategoryModalOpen(true)
  }

  const handleOpenEditCategory = (cat: AchievementCategory) => {
    setEditingCategory(cat)
    catForm.reset({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '🏆',
      color: cat.color || '#00E5FF',
      description: cat.description || '',
      coverImage: cat.coverImage || '',
      displayOrder: cat.displayOrder || 0,
      active: cat.active ?? true,
    })
    setCategoryModalOpen(true)
  }

  const onCategorySubmit = async (data: any) => {
    setActionLoading(true)
    const url = editingCategory ? `/api/achievement-categories/${editingCategory._id}` : '/api/achievement-categories'
    const method = editingCategory ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (result.success) {
        toast({
          title: 'Success',
          description: `Category ${editingCategory ? 'modified' : 'registered'} successfully.`
        })
        setCategoryModalOpen(false)
        fetchData()
      } else {
        toast({ title: 'Error', description: result.error || 'Process failed.', variant: 'destructive' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  // --- TAB 3: SETTINGS ---
  const onSettingsSubmit = async (data: any) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/achievement-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Settings Updated', description: 'Section parameters stored successfully.' })
        setSettings(result.data)
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to update settings.', variant: 'destructive' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  // --- TAB 4: TRASH & PERMANENT DELETE RESTORE ---
  const handleRestore = async (type: 'achievement' | 'category', id: string) => {
    setActionLoading(true)
    const url = type === 'achievement' ? `/api/achievements/${id}` : `/api/achievement-categories/${id}`
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletedAt: null })
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: `${type} restored.` })
        fetchData()
      } else {
        toast({ title: 'Error', description: result.error || 'Restore failed.', variant: 'destructive' })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  const handleBulkRestore = async (type: 'achievement' | 'category') => {
    setActionLoading(true)
    const items = type === 'achievement' ? deletedAchievements : deletedCategories
    try {
      await Promise.all(
        items.map(item =>
          fetch(type === 'achievement' ? `/api/achievements/${item._id}` : `/api/achievement-categories/${item._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deletedAt: null })
          })
        )
      )
      toast({ title: 'Bulk Restore', description: 'All items restored.' })
      fetchData()
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmPermanentDelete = async () => {
    if (!confirmDeleteTarget) return
    setActionLoading(true)
    const { type, id } = confirmDeleteTarget
    // Note: permanent delete of category might require cascade/move. Let's send mode if category deleting.
    const url = type === 'achievement'
      ? `/api/achievements/${id}?permanent=true`
      : `/api/achievement-categories/${id}?permanent=true`

    try {
      const res = await fetch(url, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Permanently Deleted', description: `${type} purged from database.` })
        setConfirmDeleteTarget(null)
        fetchData()
      } else if (result.code === 'ASSOCIATED_ACHIEVEMENTS_EXIST') {
        // Associated achievements block detected on hard delete too
        setConfirmDeleteTarget(null)
        setCategoryToDeleteId(id)
        setAssociatedAchievementsCount(result.count)
        setDeleteMode('move')
        const activeOtherCats = categories.filter(c => c._id !== id)
        setTargetCategoryId(activeOtherCats[0]?._id || '')
        setAssociatedAchievementsModalOpen(true)
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to hard delete.', variant: 'destructive' })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number, type: 'achievement' | 'category') => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ index, type }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropRow = async (e: React.DragEvent, targetIndex: number, type: 'achievement' | 'category') => {
    e.preventDefault()
    const dataStr = e.dataTransfer.getData('text/plain')
    if (!dataStr) return
    try {
      const { index: sourceIndex, type: dragType } = JSON.parse(dataStr)
      if (dragType !== type || sourceIndex === targetIndex) return

      if (type === 'achievement') {
        const list = [...achievements]
        const [movedItem] = list.splice(sourceIndex, 1)
        list.splice(targetIndex, 0, movedItem)
        setAchievements(list)
        const updatedItems = list.map((item, idx) => ({ id: item._id, displayOrder: idx }))
        const res = await fetch('/api/achievements', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reorder: true, items: updatedItems })
        })
        const result = await res.json()
        if (result.success) {
          toast({ title: 'Reordered', description: 'Achievements display priority saved.' })
          fetchData()
        }
      } else {
        const list = [...categories]
        const [movedItem] = list.splice(sourceIndex, 1)
        list.splice(targetIndex, 0, movedItem)
        setCategories(list)
        const updatedItems = list.map((item, idx) => ({ id: item._id, displayOrder: idx }))
        const res = await fetch('/api/achievement-categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reorder: true, items: updatedItems })
        })
        const result = await res.json()
        if (result.success) {
          toast({ title: 'Reordered', description: 'Categories display priority saved.' })
          fetchData()
        }
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Reorder failed', description: 'Failed to sync display priorities.', variant: 'destructive' })
    }
  }

  const categoryMap = new Map(categories.map(c => [c._id, c.name]))

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Achievements Index
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Maintain spotlight heroes, chronology loops, and dynamic categorization
          </p>
        </div>
        <div className="flex gap-3">
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto bg-[#0A1020]/80 p-1 border border-slate-800 gap-1 mb-6">
          <TabsTrigger value="achievements" className="gap-2 font-mono text-xs uppercase py-2">
            <Trophy className="w-3.5 h-3.5" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2 font-mono text-xs uppercase py-2">
            <FolderPlus className="w-3.5 h-3.5" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 font-mono text-xs uppercase py-2">
            <SettingsIcon className="w-3.5 h-3.5" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="trash" className="gap-2 font-mono text-xs uppercase py-2">
            <Trash className="w-3.5 h-3.5" />
            Trash Manager
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 text-[#00E5FF] animate-spin" />
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Accessing index logs...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: ACHIEVEMENTS LIST */}
            <TabsContent value="achievements" className="space-y-4 outline-none">
              <div className="flex justify-between items-center">
                <p className="text-xs font-mono text-slate-400 uppercase">
                  Sort priority by drag & drop reordering
                </p>
                <Button
                  onClick={handleOpenCreateAchievement}
                  className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement
                </Button>
              </div>

              <DataTable
                data={achievements}
                searchKey="title"
                searchPlaceholder="Filter achievements by title..."
                loading={false}
                columns={[
                  {
                    header: 'Title',
                    accessor: (item: Achievement, idx?: number) => (
                      <div 
                        draggable
                        onDragStart={(e) => typeof idx === 'number' && handleDragStart(e, idx, 'achievement')}
                        onDragOver={handleDragOver}
                        onDrop={(e) => typeof idx === 'number' && handleDropRow(e, idx, 'achievement')}
                        className="flex items-center gap-3 cursor-grab group active:cursor-grabbing select-none"
                      >
                        <Move className="w-4 h-4 text-slate-600 group-hover:text-[#00E5FF] transition-colors shrink-0" />
                        <div className="w-10 h-10 rounded bg-[#101827] border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                          {item.achievementImage ? (
                            <img src={item.achievementImage} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">{item.icon || '🏆'}</span>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 block">{item.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {item.organization || 'No Organization'}
                          </span>
                        </div>
                      </div>
                    )
                  },
                  {
                    header: 'Category',
                    accessor: (item: Achievement) => (
                      <span className="text-xs text-slate-300 font-semibold bg-[#101827] border border-slate-900 rounded-md px-2.5 py-1">
                        {typeof item.category === 'string' ? categoryMap.get(item.category) : item.category?.name || 'Unassigned'}
                      </span>
                    )
                  },
                  {
                    header: 'Year',
                    accessor: (item: Achievement) => <span className="font-mono text-slate-350">{item.year}</span>
                  },
                  {
                    header: 'Visibility',
                    accessor: (item: Achievement) => (
                      <div className="flex gap-1.5 flex-wrap">
                        {item.showInCategory && (
                          <span className="font-mono text-[8px] uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/35">
                            Category Grid
                          </span>
                        )}
                      </div>
                    )
                  },
                  {
                    header: 'Order',
                    accessor: (item: Achievement) => <span className="font-mono text-slate-400">{item.displayOrder}</span>
                  }
                ]}
                actions={(item: Achievement) => (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateAchievement(item)}
                      title="Duplicate record"
                      className="border-slate-800 hover:border-violet-500/30 hover:bg-[#7C3AED]/5 text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditAchievement(item)}
                      className="border-slate-800 hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 text-slate-400 hover:text-white"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSoftDelete('achievement', item._id!)}
                      className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              />
            </TabsContent>

            {/* TAB 2: CATEGORIES LIST */}
            <TabsContent value="categories" className="space-y-4 outline-none">
              <div className="flex justify-between items-center">
                <p className="text-xs font-mono text-slate-400 uppercase">
                  Reorder Categories priority by Drag & Drop
                </p>
                <Button
                  onClick={handleOpenCreateCategory}
                  className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>

              <DataTable
                data={categories}
                searchKey="name"
                searchPlaceholder="Filter categories by name..."
                loading={false}
                columns={[
                  {
                    header: 'Name',
                    accessor: (item: AchievementCategory, idx?: number) => (
                      <div 
                        draggable
                        onDragStart={(e) => typeof idx === 'number' && handleDragStart(e, idx, 'category')}
                        onDragOver={handleDragOver}
                        onDrop={(e) => typeof idx === 'number' && handleDropRow(e, idx, 'category')}
                        className="flex items-center gap-3 cursor-grab group active:cursor-grabbing select-none"
                      >
                        <Move className="w-4 h-4 text-slate-600 group-hover:text-[#00E5FF] transition-colors shrink-0" />
                        <div className="w-10 h-10 rounded bg-[#101827] border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                          {item.coverImage ? (
                            <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">{item.icon || '🏆'}</span>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 block">{item.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{item.slug}</span>
                        </div>
                      </div>
                    )
                  },
                  {
                    header: 'Active Status',
                    accessor: (item: AchievementCategory) => (
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
                    header: 'Color Accent',
                    accessor: (item: AchievementCategory) => (
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-350">
                        <div className="w-3.5 h-3.5 rounded border border-slate-800 shrink-0" style={{ backgroundColor: item.color || '#00E5FF' }} />
                        <span>{item.color || '#00E5FF'}</span>
                      </div>
                    )
                  },
                  {
                    header: 'Order',
                    accessor: (item: AchievementCategory) => <span className="font-mono text-slate-400">{item.displayOrder}</span>
                  }
                ]}
                actions={(item: AchievementCategory) => (
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
                      onClick={() => handleSoftDelete('category', item._id!)}
                      className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              />
            </TabsContent>

            {/* TAB 3: SECTION SETTINGS */}
            <TabsContent value="settings" className="outline-none">
              <div className="bg-[#0A1020]/40 border border-slate-900 rounded-2xl p-6 max-w-2xl">
                <h2 className="font-display font-bold text-sm text-white uppercase tracking-wider border-b border-slate-900 pb-3 mb-5">
                  Configure Achievements Parameters
                </h2>
                <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Section Display Title</Label>
                    <Input {...settingsForm.register('title')} className="bg-[#101827]/70 border-slate-800 text-white" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Subtitle Description Summary</Label>
                    <Textarea {...settingsForm.register('subtitle')} rows={3} className="bg-[#101827]/70 border-slate-800 text-white text-xs" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-5 mt-2">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={settingsForm.watch('showCategoryGrid')}
                        onCheckedChange={(checked) => settingsForm.setValue('showCategoryGrid', checked)}
                      />
                      <div>
                        <Label className="font-mono text-[9px] text-slate-350 uppercase">Show Category Grid</Label>
                        <p className="text-[8px] font-mono text-slate-500 uppercase">Dynamic category analytics list</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        checked={settingsForm.watch('animationsEnabled')}
                        onCheckedChange={(checked) => settingsForm.setValue('animationsEnabled', checked)}
                      />
                      <div>
                        <Label className="font-mono text-[9px] text-slate-350 uppercase">Animations Enabled</Label>
                        <p className="text-[8px] font-mono text-slate-500 uppercase">Subtle Framer Motion triggers</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-900">
                    <Button
                      type="submit"
                      disabled={actionLoading}
                      className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
                    >
                      {actionLoading ? 'Saving...' : 'Apply Section Settings'}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* TAB 4: TRASH MANAGER */}
            <TabsContent value="trash" className="space-y-6 outline-none">
              {/* Soft Deleted Achievements */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <h3 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Archive className="w-4 h-4 text-slate-500" />
                    Deleted Achievements ({deletedAchievements.length})
                  </h3>
                  {deletedAchievements.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkRestore('achievement')}
                      className="border-slate-800 font-mono text-[10px] uppercase hover:bg-slate-900"
                    >
                      Bulk Restore
                    </Button>
                  )}
                </div>

                {deletedAchievements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-slate-900 bg-[#0A1020]/20 text-center">
                    <Trophy className="w-6 h-6 text-slate-700 mb-2" />
                    <p className="font-mono text-[10px] text-slate-500 uppercase">Achievements Trash bin is empty.</p>
                  </div>
                ) : (
                  <DataTable
                    data={deletedAchievements}
                    searchKey="title"
                    searchPlaceholder="Filter trash..."
                    loading={false}
                    columns={[
                      {
                        header: 'Title',
                        accessor: (item: Achievement) => (
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{item.icon || '🏆'}</span>
                            <div>
                              <span className="font-bold text-slate-400 block">{item.title}</span>
                              <span className="text-[10px] text-slate-600 font-mono">{item.organization}</span>
                            </div>
                          </div>
                        )
                      },
                      {
                        header: 'Deleted At',
                        accessor: (item: Achievement) => (
                          <span className="font-mono text-slate-500 text-xs">
                            {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : '—'}
                          </span>
                        )
                      }
                    ]}
                    actions={(item: Achievement) => (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore('achievement', item._id!)}
                          className="border-slate-800 hover:border-green-500/30 hover:bg-green-950/10 text-slate-400 hover:text-green-400 font-mono text-[10px] uppercase"
                        >
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmDeleteTarget({ type: 'achievement', id: item._id!, permanent: true })}
                          className="border-slate-800 hover:border-red-550/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400 font-mono text-[10px] uppercase"
                        >
                          Hard Delete
                        </Button>
                      </div>
                    )}
                  />
                )}
              </div>

              {/* Soft Deleted Categories */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <h3 className="font-display font-bold text-sm text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <FolderPlus className="w-4 h-4 text-slate-500" />
                    Deleted Categories ({deletedCategories.length})
                  </h3>
                  {deletedCategories.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkRestore('category')}
                      className="border-slate-800 font-mono text-[10px] uppercase hover:bg-slate-900"
                    >
                      Bulk Restore
                    </Button>
                  )}
                </div>

                {deletedCategories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-slate-900 bg-[#0A1020]/20 text-center">
                    <FolderPlus className="w-6 h-6 text-slate-700 mb-2" />
                    <p className="font-mono text-[10px] text-slate-500 uppercase">Categories Trash bin is empty.</p>
                  </div>
                ) : (
                  <DataTable
                    data={deletedCategories}
                    searchKey="name"
                    searchPlaceholder="Filter trash..."
                    loading={false}
                    columns={[
                      {
                        header: 'Name',
                        accessor: (item: AchievementCategory) => (
                          <div>
                            <span className="font-bold text-slate-400 block">{item.name}</span>
                            <span className="text-[10px] text-slate-600 font-mono">{item.slug}</span>
                          </div>
                        )
                      },
                      {
                        header: 'Deleted At',
                        accessor: (item: AchievementCategory) => (
                          <span className="font-mono text-slate-500 text-xs">
                            {item.deletedAt ? new Date(item.deletedAt).toLocaleDateString() : '—'}
                          </span>
                        )
                      }
                    ]}
                    actions={(item: AchievementCategory) => (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore('category', item._id!)}
                          className="border-slate-800 hover:border-green-500/30 hover:bg-green-950/10 text-slate-400 hover:text-green-400 font-mono text-[10px] uppercase"
                        >
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmDeleteTarget({ type: 'category', id: item._id!, permanent: true })}
                          className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400 font-mono text-[10px] uppercase"
                        >
                          Hard Delete
                        </Button>
                      </div>
                    )}
                  />
                )}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* --- ADD / EDIT ACHIEVEMENT DIALOG MODAL --- */}
      <Dialog open={achievementModalOpen} onOpenChange={setAchievementModalOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-xl backdrop-blur-xl max-h-[90vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingAchievement ? 'Modify Achievement Node' : 'Register Achievement Node'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={achForm.handleSubmit(onAchievementSubmit)} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Achievement Title</Label>
              <Input
                {...achForm.register('title')}
                placeholder="e.g. Smart India Hackathon Finalist"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {achForm.formState.errors.title && (
                <p className="text-xs text-red-500 font-mono">{achForm.formState.errors.title.message as string}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Organization / Issuer</Label>
                <Input
                  {...achForm.register('organization')}
                  placeholder="e.g. Ministry of Education"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Category</Label>
                <select
                  {...achForm.register('category')}
                  className="w-full bg-[#101827]/70 border border-slate-800 rounded-lg text-slate-300 p-2 text-xs font-mono focus:border-[#00E5FF]/40 outline-none h-10"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id} className="bg-[#0A1020]">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Date (e.g. Dec 2025)</Label>
                <Input
                  {...achForm.register('date')}
                  placeholder="Dec 2025"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Year Tag (e.g. 2025)</Label>
                <Input
                  {...achForm.register('year')}
                  placeholder="2025"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Display Order</Label>
                <Input
                  type="number"
                  {...achForm.register('displayOrder', { valueAsNumber: true })}
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Icon Emoji</Label>
                <Input
                  {...achForm.register('icon')}
                  placeholder="e.g. 🏆"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Color Accent (e.g. #00E5FF)</Label>
                <Input
                  {...achForm.register('badgeColor')}
                  placeholder="e.g. #00E5FF"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            {/* Metrics highlight block */}
            <div className="border border-slate-900 p-3 rounded-lg bg-[#0F172A]/30 space-y-3">
              <Label className="font-mono text-[10px] text-slate-400 uppercase block border-b border-slate-900 pb-1.5">Metric Spotlight Block</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-mono text-[9px] text-slate-500 uppercase">Metric Value (e.g. 500+ / Top 5)</Label>
                  <Input
                    {...achForm.register('metricValue')}
                    placeholder="e.g. 500+ / Top 5"
                    className="bg-[#101827]/70 border-slate-800 text-white text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-mono text-[9px] text-slate-500 uppercase">Metric Label (e.g. Problems Solved)</Label>
                  <Input
                    {...achForm.register('metricLabel')}
                    placeholder="e.g. Problems Solved / Win"
                    className="bg-[#101827]/70 border-slate-800 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Description Summary</Label>
              <Textarea
                {...achForm.register('description')}
                placeholder="Describe the milestone context and metrics..."
                rows={3}
                className="bg-[#101827]/70 border-slate-800 text-white text-xs"
              />
            </div>

            {/* Tags input */}
            <div className="border border-slate-900 p-3 rounded-lg bg-[#0F172A]/30 space-y-2">
              <Label className="font-mono text-[10px] text-slate-400 uppercase block border-b border-slate-900 pb-1.5">Tags chips</Label>
              <div className="flex flex-wrap gap-1.5 py-1">
                {achTagsVal.map((t: string) => (
                  <span key={t} className="flex items-center gap-1 text-[10px] font-mono bg-slate-900 text-slate-350 px-2 py-0.5 rounded border border-slate-800 uppercase">
                    {t}
                    <button type="button" onClick={() => handleRemoveTag(t)} className="text-red-400 hover:text-red-300 ml-0.5">×</button>
                  </span>
                ))}
                {achTagsVal.length === 0 && <span className="text-[10px] text-slate-500 font-mono uppercase">No tags added.</span>}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Type tag and press Enter"
                  className="bg-[#101827]/70 border-slate-800 text-white text-xs font-mono flex-1 h-8"
                />
                <Button type="button" size="sm" onClick={handleAddTag} className="h-8 text-xs font-mono uppercase bg-slate-900 border border-slate-800 text-slate-300">
                  Add
                </Button>
              </div>
            </div>

            {/* Image Manager */}
            <div className="border border-slate-900 p-3 rounded-lg bg-[#0F172A]/30 space-y-3">
              <Label className="font-mono text-[10px] text-slate-400 uppercase block border-b border-slate-900 pb-1.5">Achievement Image</Label>
              <div className="flex gap-3">
                <Input
                  {...achForm.register('achievementImage')}
                  placeholder="Custom image URL (or upload)"
                  className="bg-[#101827]/70 border-slate-800 text-white text-xs font-mono flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="relative overflow-hidden border-slate-800 bg-[#101827]/70 hover:bg-slate-900/60 font-mono text-[10px] px-3 py-2 cursor-pointer shrink-0"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadFile(e, 'achievementImage')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              </div>

              {achImageVal && (
                <div className="relative border border-slate-900 rounded-lg overflow-hidden h-36 bg-slate-950 flex items-center justify-center group">
                  <img src={achImageVal} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => achForm.setValue('achievementImage', '')}
                      className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-[10px] uppercase font-mono px-2 h-7"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">External Achievement URL Link</Label>
              <Input
                {...achForm.register('achievementUrl')}
                placeholder="https://credential-link.com"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {achForm.formState.errors.achievementUrl && (
                <p className="text-xs text-red-500 font-mono">{achForm.formState.errors.achievementUrl.message as string}</p>
              )}
            </div>

            {/* Visibility switches */}
            <div className="border-t border-slate-900 pt-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={achForm.watch('showInCategory')}
                  onCheckedChange={(checked) => achForm.setValue('showInCategory', checked)}
                />
                <div>
                  <Label className="font-mono text-[10px] text-slate-350 uppercase">Show In Category Grid</Label>
                  <p className="text-[8px] font-mono text-slate-500 uppercase">Render in Achievements Category list</p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-900 font-mono text-xs uppercase tracking-wider">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAchievementModalOpen(false)}
                className="border-slate-800 bg-transparent text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white"
              >
                {actionLoading ? 'Saving...' : editingAchievement ? 'Apply Changes' : 'Initialize Node'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- ADD / EDIT CATEGORY DIALOG MODAL --- */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-md backdrop-blur-xl max-h-[85vh] overflow-y-auto pr-3">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingCategory ? 'Modify Category Settings' : 'Create Category Node'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={catForm.handleSubmit(onCategorySubmit)} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Category Name</Label>
              <Input
                {...catForm.register('name')}
                placeholder="e.g. Hackathons"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {catForm.formState.errors.name && (
                <p className="text-xs text-red-500 font-mono">{catForm.formState.errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Category Slug</Label>
              <Input
                {...catForm.register('slug')}
                placeholder="e.g. hackathons"
                className="bg-[#101827]/70 border-slate-800 text-white font-mono"
              />
              {catForm.formState.errors.slug && (
                <p className="text-xs text-red-500 font-mono">{catForm.formState.errors.slug.message as string}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Category Icon</Label>
                <Input
                  {...catForm.register('icon')}
                  placeholder="e.g. 🏆"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Color Theme Accent (e.g. #00E5FF)</Label>
                <Input
                  {...catForm.register('color')}
                  placeholder="e.g. #00E5FF"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Description Summary</Label>
              <Textarea
                {...catForm.register('description')}
                placeholder="Write a brief category description..."
                rows={2}
                className="bg-[#101827]/70 border-slate-800 text-white text-xs"
              />
            </div>

            {/* Category Cover Image banner uploader */}
            <div className="border border-slate-900 p-3 rounded-lg bg-[#0F172A]/30 space-y-3">
              <Label className="font-mono text-[10px] text-slate-400 uppercase block border-b border-slate-900 pb-1.5">Category Cover Image (Banner)</Label>
              <div className="flex gap-3">
                <Input
                  {...catForm.register('coverImage')}
                  placeholder="Banner image URL (or upload)"
                  className="bg-[#101827]/70 border-slate-800 text-white text-xs font-mono flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="relative overflow-hidden border-slate-800 bg-[#101827]/70 hover:bg-slate-900/60 font-mono text-[10px] px-3 py-2 cursor-pointer shrink-0"
                  disabled={uploadingCover}
                >
                  {uploadingCover ? 'Uploading...' : 'Upload Cover'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadFile(e, 'coverImage')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              </div>

              {catCoverImageVal && (
                <div className="relative border border-slate-900 rounded-lg overflow-hidden h-24 bg-slate-950 flex items-center justify-center group">
                  <img src={catCoverImageVal} alt="Category Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => catForm.setValue('coverImage', '')}
                      className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-[10px] uppercase font-mono px-2 h-7"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 items-center border-t border-slate-900 pt-3">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Display Order Priority</Label>
                <Input
                  type="number"
                  {...catForm.register('displayOrder', { valueAsNumber: true })}
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Switch
                  checked={catForm.watch('active')}
                  onCheckedChange={(checked) => catForm.setValue('active', checked)}
                />
                <div>
                  <Label className="font-mono text-[10px] text-slate-350 uppercase">Active Status</Label>
                  <p className="text-[8px] font-mono text-slate-500 uppercase">Enable in grid filter lists</p>
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
                {actionLoading ? 'Saving...' : editingCategory ? 'Apply Changes' : 'Initialize Node'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- CATEGORY CONTAINS ASSOCIATED ACHIEVEMENTS RESOLUTION MODAL --- */}
      <Dialog open={associatedAchievementsModalOpen} onOpenChange={setAssociatedAchievementsModalOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
              Category Contains Achievements
            </DialogTitle>
            <DialogDescription className="text-xs font-mono text-slate-400 uppercase tracking-wide mt-1.5 block">
              This category governs {associatedAchievementsCount} active achievements. Please choose a mitigation action before proceeding with category removal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="flex flex-col gap-2 font-mono text-xs uppercase">
              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-900 bg-[#0F172A]/30 cursor-pointer select-none">
                <input
                  type="radio"
                  name="deleteMode"
                  value="move"
                  checked={deleteMode === 'move'}
                  onChange={() => setDeleteMode('move')}
                  className="accent-[#00E5FF] mt-0.5"
                />
                <div>
                  <span className="font-semibold text-slate-200 block">Option A: Move Achievements</span>
                  <span className="text-[9px] text-slate-500">Reassign associated achievements to another category</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-900 bg-[#0F172A]/30 cursor-pointer select-none">
                <input
                  type="radio"
                  name="deleteMode"
                  value="cascade"
                  checked={deleteMode === 'cascade'}
                  onChange={() => setDeleteMode('cascade')}
                  className="accent-red-500 mt-0.5"
                />
                <div>
                  <span className="font-semibold text-slate-200 block text-red-400">Option B: Cascade Delete</span>
                  <span className="text-[9px] text-slate-500">Delete this category and all its achievements simultaneously</span>
                </div>
              </label>
            </div>

            {deleteMode === 'move' && (
              <div className="space-y-1.5 pt-2">
                <Label className="font-mono text-[9px] text-slate-500 uppercase">Target Reassignment Category</Label>
                <select
                  value={targetCategoryId}
                  onChange={(e) => setTargetCategoryId(e.target.value)}
                  className="w-full bg-[#101827]/70 border border-slate-800 rounded-lg text-slate-350 p-2 text-xs font-mono focus:border-[#00E5FF]/40 outline-none h-10"
                >
                  {categories
                    .filter(c => c._id !== categoryToDeleteId)
                    .map((cat) => (
                      <option key={cat._id} value={cat._id} className="bg-[#0A1020]">
                        {cat.name}
                      </option>
                    ))}
                </select>
                {categories.filter(c => c._id !== categoryToDeleteId).length === 0 && (
                  <p className="text-[9px] text-red-400 font-mono uppercase mt-1">
                    Error: No other categories exist to reassign achievements to. You must Cascade Delete or create another category first.
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-slate-900 font-mono text-xs uppercase tracking-wider">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setAssociatedAchievementsModalOpen(false)
                setCategoryToDeleteId(null)
              }}
              className="border-slate-800 bg-transparent text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResolveCategoryDeletion}
              disabled={actionLoading || (deleteMode === 'move' && !targetCategoryId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {actionLoading ? 'Deleting...' : 'Execute Mitigation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- CONFIRM PERMANENT PURGE DIALOG --- */}
      <ConfirmDialog
        isOpen={confirmDeleteTarget !== null}
        onClose={() => setConfirmDeleteTarget(null)}
        onConfirm={handleConfirmPermanentDelete}
        loading={actionLoading}
        title="Destroy Record Permanently"
        description="Are you absolutely sure you want to permanently purge this record from the database? This action is irreversible."
      />
    </div>
  )
}
