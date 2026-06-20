'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { certificationSchema } from '@/lib/validation'
import { Plus, Edit, Trash2, Award, RefreshCw, X, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import IssuerLogo from '@/components/IssuerLogo'

interface Certification {
  _id: string
  title: string
  issuer: string
  logoMode: 'auto' | 'custom'
  logo?: string
  logoAlt?: string
  thumbnail?: string
  tags?: string[]
  certificateUrl?: string
  credentialUrl?: string
  featured: boolean
  sortOrder: number
  isPublished: boolean
}

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: '',
      issuer: '',
      logoMode: 'auto' as 'auto' | 'custom',
      logo: '',
      logoAlt: '',
      thumbnail: '',
      tags: [] as string[],
      certificateUrl: '',
      credentialUrl: '',
      featured: false,
      sortOrder: 0,
      isPublished: true,
    },
  })

  const featuredValue = watch('featured')
  const isPublishedValue = watch('isPublished')
  const logoModeValue = watch('logoMode')
  const logoValue = watch('logo')
  const issuerValue = watch('issuer')

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      if (result.success && result.data?.url) {
        setValue('logo', result.data.url, { shouldDirty: true })
        toast({
          title: 'Success',
          description: 'Custom badge logo scan uploaded successfully.',
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
        description: 'An error occurred during file upload.',
        variant: 'destructive',
      })
    } finally {
      setUploadingLogo(false)
    }
  }

  const fetchCerts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/certifications')
      const result = await res.json()
      if (result.success) {
        setCerts(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Query Error',
        description: 'Failed to retrieve certifications list.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCerts()
  }, [])

  const handleOpenCreate = () => {
    setEditingCert(null)
    setTags([])
    reset({
      title: '',
      issuer: '',
      logoMode: 'auto',
      logo: '',
      logoAlt: '',
      thumbnail: '',
      tags: [],
      certificateUrl: '',
      credentialUrl: '',
      featured: false,
      sortOrder: 0,
      isPublished: true,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (cert: Certification) => {
    setEditingCert(cert)
    setTags(cert.tags || [])
    reset({
      title: cert.title,
      issuer: cert.issuer,
      logoMode: cert.logoMode || 'auto',
      logo: cert.logo || '',
      logoAlt: cert.logoAlt || '',
      thumbnail: cert.thumbnail || '',
      tags: cert.tags || [],
      certificateUrl: cert.certificateUrl || '',
      credentialUrl: cert.credentialUrl || '',
      featured: cert.featured,
      sortOrder: cert.sortOrder || 0,
      isPublished: cert.isPublished ?? true,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)
    
    // Filter empty tags
    const filteredTags = tags.map(t => t.trim()).filter(t => t.length > 0)
    data.tags = filteredTags

    const url = editingCert ? `/api/certifications/${editingCert._id}` : '/api/certifications'
    const method = editingCert ? 'PUT' : 'POST'

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
          description: editingCert ? 'Certification record modified' : 'Certification record registered',
        })
        setDialogOpen(false)
        fetchCerts()
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
        description: 'Failed to deploy certification',
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
      const res = await fetch(`/api/certifications/${deleteId}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Certification record deleted.',
        })
        setDeleteId(null)
        fetchCerts()
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
      header: 'Credential Node',
      accessor: (item: Certification) => (
        <div className="flex items-center gap-3">
          <Award className="w-4.5 h-4.5 text-[#00E5FF]" />
          <div>
            <span className="font-semibold text-slate-200 block">{item.title}</span>
            <span className="font-mono text-[9px] text-[#FF4FD8] uppercase">{item.issuer}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Tags / Skills',
      accessor: (item: Certification) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {(item.tags || []).slice(0, 3).map((t, i) => (
            <span key={i} className="font-mono text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
              {t}
            </span>
          ))}
          {(item.tags || []).length > 3 && <span className="text-[9px] text-slate-500 font-mono">+{(item.tags || []).length - 3}</span>}
        </div>
      ),
    },
    {
      header: 'Visibility',
      accessor: (item: Certification) => (
        <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-full ${
          (item.isPublished ?? true)
            ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30' 
            : 'bg-slate-900 text-slate-500 border border-slate-800'
        }`}>
          {(item.isPublished ?? true) ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      header: 'Sort Order',
      accessor: (item: Certification) => <span className="font-mono text-slate-400">{item.sortOrder}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Certification Logs
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Track authorized developer credentials
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchCerts}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Certification</span>
          </Button>
        </div>
      </div>

      {/* Certs DataTable */}
      <DataTable
        data={certs}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Filter credentials by title..."
        loading={loading}
        actions={(item: Certification) => (
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

      {/* Add/Edit dialog modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingCert ? 'Modify Credential Node' : 'Register Credential Node'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-3 max-h-[75vh] overflow-y-auto pr-2">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Certification Title</Label>
              <Input
                {...register('title')}
                placeholder="e.g. AWS Certified Cloud Practitioner"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.title && <p className="text-xs text-red-500 font-mono">{errors.title.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Issuer</Label>
              <Input
                {...register('issuer')}
                placeholder="e.g. Amazon Web Services"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.issuer && <p className="text-xs text-red-500 font-mono">{errors.issuer.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Issuer Dropdown Select</Label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setValue('issuer', e.target.value, { shouldDirty: true })
                  }
                }}
                value={issuerValue}
                className="w-full bg-[#101827]/70 border border-slate-800 rounded-lg text-slate-300 p-2 text-xs font-mono focus:border-[#00E5FF]/40 outline-none"
              >
                <option value="">-- Choose Common Issuer --</option>
                <option value="AWS">AWS</option>
                <option value="Google">Google</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Coursera">Coursera</option>
                <option value="Meta">Meta</option>
                <option value="NPTEL">NPTEL</option>
                <option value="Amazon">Amazon</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Sort Order</Label>
                <Input
                  type="number"
                  {...register('sortOrder', { valueAsNumber: true })}
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Thumbnail Banner (Optional)</Label>
                <Input
                  {...register('thumbnail')}
                  placeholder="e.g. /placeholders/placeholder-cert.png"
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            {/* Logo Manager */}
            <div className="border border-slate-900 p-3 rounded-lg bg-[#0F172A]/30 space-y-3">
              <Label className="font-mono text-[10px] text-slate-400 uppercase block border-b border-slate-900 pb-1.5">Logo Manager</Label>
              <div className="flex gap-4 py-1">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-[11px] text-slate-350 select-none">
                  <input
                    type="radio"
                    value="auto"
                    checked={logoModeValue === 'auto'}
                    onChange={() => setValue('logoMode', 'auto', { shouldDirty: true })}
                    className="accent-cyan-400"
                  />
                  Auto Mapped Logo
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-mono text-[11px] text-slate-350 select-none">
                  <input
                    type="radio"
                    value="custom"
                    checked={logoModeValue === 'custom'}
                    onChange={() => setValue('logoMode', 'custom', { shouldDirty: true })}
                    className="accent-cyan-400"
                  />
                  Custom Logo Badge
                </label>
              </div>

              {logoModeValue === 'auto' ? (
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#0F172A]/50 border border-slate-900/60 space-y-2">
                  <span className="font-mono text-[9px] text-slate-500 uppercase">Auto Logo Mapping Preview</span>
                  <IssuerLogo issuer={issuerValue} logoMode="auto" className="w-16 h-16" />
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex gap-2">
                    <Input
                      {...register('logo')}
                      placeholder="Custom Logo URL (or upload below)"
                      className="bg-[#101827]/70 border-slate-800 text-white text-xs flex-1 font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="relative overflow-hidden border-slate-800 bg-[#101827]/70 hover:bg-slate-900/60 font-mono text-[10px] px-3 py-2 cursor-pointer"
                      disabled={uploadingLogo}
                    >
                      {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadLogo}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <Label className="font-mono text-[9px] text-slate-500 uppercase">Logo Alt Text</Label>
                    <Input
                      {...register('logoAlt')}
                      placeholder="e.g. AWS Badge logo"
                      className="bg-[#101827]/70 border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#0F172A]/50 border border-slate-900/60 space-y-2">
                    <span className="font-mono text-[9px] text-slate-500 uppercase">Custom Badge Preview</span>
                    {logoValue ? (
                      <IssuerLogo issuer={issuerValue} logoMode="custom" logo={logoValue} logoAlt={watch('logoAlt')} className="w-16 h-16" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-600 text-[10px] font-mono uppercase text-center p-1">
                        No logo uploaded
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Links Manager */}
            <div className="border border-slate-900 p-3 rounded-lg bg-[#0F172A]/30 space-y-3">
              <Label className="font-mono text-[10px] text-slate-400 uppercase block border-b border-slate-900 pb-1.5">Links Manager</Label>
              <div className="space-y-1.5">
                <Label className="font-mono text-[9px] text-slate-500 uppercase">Certificate URL</Label>
                <Input
                  {...register('certificateUrl')}
                  placeholder="URL to Certificate PDF/Document"
                  className="bg-[#101827]/70 border-slate-800 text-white text-xs"
                />
                {errors.certificateUrl && <p className="text-xs text-red-500 font-mono">{errors.certificateUrl.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[9px] text-slate-500 uppercase">Credential URL</Label>
                <Input
                  {...register('credentialUrl')}
                  placeholder="URL to Verifiable Badge/Link"
                  className="bg-[#101827]/70 border-slate-800 text-white text-xs"
                />
                {errors.credentialUrl && <p className="text-xs text-red-500 font-mono">{errors.credentialUrl.message as string}</p>}
              </div>
            </div>

            {/* Tags Manager Repeater */}
            <div className="border border-slate-900 p-3 rounded-lg bg-[#0F172A]/30 space-y-3">
              <Label className="font-mono text-[10px] text-slate-400 uppercase block border-b border-slate-900 pb-1.5">Tags Manager</Label>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={tag}
                      onChange={(e) => {
                        const updated = [...tags]
                        updated[index] = e.target.value
                        setTags(updated)
                        setValue('tags', updated, { shouldDirty: true })
                      }}
                      placeholder="e.g. Cloud Computing"
                      className="bg-[#101827]/70 border-slate-800 text-white font-mono text-xs flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = tags.filter((_, idx) => idx !== index)
                        setTags(updated)
                        setValue('tags', updated, { shouldDirty: true })
                      }}
                      className="border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 shrink-0 h-8"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          if (index === 0) return
                          const updated = [...tags]
                          const temp = updated[index]
                          updated[index] = updated[index - 1]
                          updated[index - 1] = temp
                          setTags(updated)
                          setValue('tags', updated, { shouldDirty: true })
                        }}
                        className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 text-[10px]"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={index === tags.length - 1}
                        onClick={() => {
                          if (index === tags.length - 1) return
                          const updated = [...tags]
                          const temp = updated[index]
                          updated[index] = updated[index + 1]
                          updated[index + 1] = temp
                          setTags(updated)
                          setValue('tags', updated, { shouldDirty: true })
                        }}
                        className="text-slate-500 hover:text-cyan-400 disabled:opacity-30 text-[10px]"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const updated = [...tags, '']
                  setTags(updated)
                  setValue('tags', updated, { shouldDirty: true })
                }}
                className="w-full border-dashed border-slate-800 hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 text-slate-400 hover:text-white font-mono text-xs uppercase"
              >
                + Add Tag
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-t border-slate-900 mt-2">
              <div className="flex items-center gap-3">
                <Switch
                  checked={featuredValue}
                  onCheckedChange={(checked) => setValue('featured', checked)}
                />
                <div>
                  <Label className="font-mono text-[10px] text-slate-300 uppercase">Featured Element</Label>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Showcase on top of credentials view</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={isPublishedValue}
                  onCheckedChange={(checked) => setValue('isPublished', checked)}
                />
                <div>
                  <Label className="font-mono text-[10px] text-slate-300 uppercase">Published</Label>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Showcase in certifications listing</p>
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
                {actionLoading ? 'Deploying...' : editingCert ? 'Apply Changes' : 'Initialize Node'}
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
        title="Destroy Credential Record"
        description="Are you sure you want to remove this verification entry? This operation is permanent."
      />
    </div>
  )
}
