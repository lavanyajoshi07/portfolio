'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { certificationSchema } from '@/lib/validation'
import { Plus, Edit, Trash2, Award, RefreshCw, Calendar } from 'lucide-react'
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
  issueDate: string
  expiryDate?: string
  credentialUrl?: string
  certificateImage?: string
  skills?: string[]
  featured: boolean
}

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [skillsString, setSkillsString] = useState('')
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
      issueDate: '',
      expiryDate: '',
      credentialUrl: '',
      certificateImage: '',
      skills: [] as string[],
      featured: false,
    },
  })

  const featuredValue = watch('featured')
  const certImageValue = watch('certificateImage')
  const issuerValue = watch('issuer')
  const [uploadingCertImg, setUploadingCertImg] = useState(false)

  const handleUploadCertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCertImg(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      if (result.success && result.data?.url) {
        setValue('certificateImage', result.data.url, { shouldDirty: true })
        toast({
          title: 'Success',
          description: 'Certificate scan uploaded successfully.',
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
      setUploadingCertImg(false)
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
        description: 'Failed to retrieve certifications logs.',
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
    setSkillsString('')
    reset({
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialUrl: '',
      certificateImage: '',
      skills: [],
      featured: false,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (cert: Certification) => {
    setEditingCert(cert)
    setSkillsString((cert.skills || []).join(', '))
    reset({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate || '',
      credentialUrl: cert.credentialUrl || '',
      certificateImage: cert.certificateImage || '',
      skills: cert.skills || [],
      featured: cert.featured,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)
    
    // Parse skills
    const parsedSkills = skillsString
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    data.skills = parsedSkills

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
      header: 'Issue Date',
      accessor: (item: Certification) => (
        <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>{item.issueDate}</span>
        </div>
      ),
    },
    {
      header: 'Associated Skills',
      accessor: (item: Certification) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {(item.skills || []).slice(0, 3).map((s, i) => (
            <span key={i} className="font-mono text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
              {s}
            </span>
          ))}
          {(item.skills || []).length > 3 && <span className="text-[9px] text-slate-500 font-mono">+{(item.skills || []).length - 3}</span>}
        </div>
      ),
    },
    {
      header: 'Featured',
      accessor: (item: Certification) => (
        <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-full ${
          item.featured 
            ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30' 
            : 'bg-slate-900 text-slate-500 border border-slate-800'
        }`}>
          {item.featured ? 'Yes' : 'No'}
        </span>
      ),
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Certification Title</Label>
              <Input
                {...register('title')}
                placeholder="e.g. AWS Cloud Practitioner"
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
                <option value="NPTEL">NPTEL</option>
                <option value="Amazon">Amazon</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Issue Date</Label>
                <Input
                  {...register('issueDate')}
                  placeholder="e.g. May 2026"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
                {errors.issueDate && <p className="text-xs text-red-500 font-mono">{errors.issueDate.message as string}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Expiry Date (Optional)</Label>
                <Input
                  {...register('expiryDate')}
                  placeholder="e.g. May 2029"
                  className="bg-[#101827]/70 border-slate-800 text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Credential URI</Label>
              <Input
                {...register('credentialUrl')}
                placeholder="Verifiable validation URL"
                className="bg-[#101827]/70 border-slate-800 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 border border-slate-900 p-3 rounded-lg bg-[#0F172A]/50">
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="font-mono text-[9px] text-slate-500 uppercase">Issuer Logo Preview</span>
                <IssuerLogo issuer={issuerValue} className="w-16 h-16" />
              </div>
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="font-mono text-[9px] text-slate-500 uppercase">Certificate Scan Preview</span>
                {certImageValue ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={certImageValue}
                    alt="Certificate Scan"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-800"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 text-[10px] font-mono uppercase text-center p-1">
                    No image uploaded
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Certificate Scan Image</Label>
              <div className="flex gap-2">
                <Input
                  {...register('certificateImage')}
                  placeholder="Scan Image URL (or upload via button)"
                  className="bg-[#101827]/70 border-slate-800 text-white text-xs flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="relative overflow-hidden border-slate-800 bg-[#101827]/70 hover:bg-slate-900/60 font-mono text-[10px] px-3 py-2 cursor-pointer"
                  disabled={uploadingCertImg}
                >
                  {uploadingCertImg ? 'Uploading...' : 'Upload File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadCertImage}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Skills Linked (Comma Separated)</Label>
              <Input
                value={skillsString}
                onChange={(e) => setSkillsString(e.target.value)}
                placeholder="AWS, Cloud, Security"
                className="bg-[#101827]/70 border-slate-800 text-white font-mono text-xs"
              />
            </div>

            <div className="flex items-center gap-3 py-2 border-t border-slate-900 mt-2">
              <Switch
                checked={featuredValue}
                onCheckedChange={(checked) => setValue('featured', checked)}
              />
              <div>
                <Label className="font-mono text-[10px] text-slate-300 uppercase">Featured Element</Label>
                <p className="text-[9px] font-mono text-slate-500 uppercase">Showcase on top of credentials view</p>
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
