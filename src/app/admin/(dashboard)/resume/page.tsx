'use client'

import { useEffect, useState } from 'react'
import { 
  Save, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Trophy, 
  Award, 
  User, 
  FileText,
  ListPlus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface ResumeSkill {
  label: string
  value: string
}

interface ResumeProject {
  title: string
  technologies: string
  bullets: string[]
}

interface ResumeExperience {
  role: string
  company: string
  duration: string
  bullets: string[]
}

interface ResumeEducation {
  degree: string
  institution: string
  duration: string
  coursework: string
}

interface ResumeSoftSkill {
  title: string
  description: string
}

interface ResumeData {
  name: string
  email: string
  phone: string
  github: string
  linkedin: string
  address: string
  summary: string
  skills: ResumeSkill[]
  projects: ResumeProject[]
  experience: ResumeExperience[]
  education: ResumeEducation[]
  certifications: string[]
  achievements: string[]
  softSkills: ResumeSoftSkill[]
}

export default function ResumePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  
  const [resume, setResume] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    address: '',
    summary: '',
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certifications: [],
    achievements: [],
    softSkills: [],
  })

  const fetchResume = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/resume')
      const result = await res.json()
      if (result.success && result.data) {
        setResume({
          name: result.data.name || '',
          email: result.data.email || '',
          phone: result.data.phone || '',
          github: result.data.github || '',
          linkedin: result.data.linkedin || '',
          address: result.data.address || '',
          summary: result.data.summary || '',
          skills: result.data.skills || [],
          projects: result.data.projects || [],
          experience: result.data.experience || [],
          education: result.data.education || [],
          certifications: result.data.certifications || [],
          achievements: result.data.achievements || [],
          softSkills: result.data.softSkills || [],
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Query Error',
        description: 'Failed to retrieve resume details.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResume()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      })
      const result = await res.json()
      if (result.success) {
        toast({
          title: 'Resume Rebuilt',
          description: 'Mongoose database synchronized and public/resume.html rebuilt successfully!',
        })
      } else {
        toast({
          title: 'Saving Failed',
          description: result.error || 'Check validation constraints.',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Transmission Error',
        description: 'Could not connect to the API server.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  // --- Dynamic Skills CRUD ---
  const handleAddSkill = () => {
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, { label: '', value: '' }]
    }))
  }
  const handleRemoveSkill = (index: number) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }
  const handleSkillChange = (index: number, field: keyof ResumeSkill, val: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map((item, i) => i === index ? { ...item, [field]: val } : item)
    }))
  }

  // --- Dynamic Projects CRUD ---
  const handleAddProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', technologies: '', bullets: [''] }]
    }))
  }
  const handleRemoveProject = (index: number) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }
  const handleProjectChange = (index: number, field: keyof Omit<ResumeProject, 'bullets'>, val: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map((item, i) => i === index ? { ...item, [field]: val } : item)
    }))
  }
  const handleAddProjectBullet = (projIdx: number) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map((item, i) => i === projIdx ? { ...item, bullets: [...item.bullets, ''] } : item)
    }))
  }
  const handleRemoveProjectBullet = (projIdx: number, bulletIdx: number) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map((item, i) => i === projIdx ? { ...item, bullets: item.bullets.filter((_, bi) => bi !== bulletIdx) } : item)
    }))
  }
  const handleProjectBulletChange = (projIdx: number, bulletIdx: number, val: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map((item, i) => i === projIdx ? { ...item, bullets: item.bullets.map((b, bi) => bi === bulletIdx ? val : b) } : item)
    }))
  }

  // --- Dynamic Experience CRUD ---
  const handleAddExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { role: '', company: '', duration: '', bullets: [''] }]
    }))
  }
  const handleRemoveExperience = (index: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }
  const handleExperienceChange = (index: number, field: keyof Omit<ResumeExperience, 'bullets'>, val: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((item, i) => i === index ? { ...item, [field]: val } : item)
    }))
  }
  const handleAddExperienceBullet = (expIdx: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((item, i) => i === expIdx ? { ...item, bullets: [...item.bullets, ''] } : item)
    }))
  }
  const handleRemoveExperienceBullet = (expIdx: number, bulletIdx: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((item, i) => i === expIdx ? { ...item, bullets: item.bullets.filter((_, bi) => bi !== bulletIdx) } : item)
    }))
  }
  const handleExperienceBulletChange = (expIdx: number, bulletIdx: number, val: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map((item, i) => i === expIdx ? { ...item, bullets: item.bullets.map((b, bi) => bi === bulletIdx ? val : b) } : item)
    }))
  }

  // --- Dynamic Education CRUD ---
  const handleAddEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', duration: '', coursework: '' }]
    }))
  }
  const handleRemoveEducation = (index: number) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }
  const handleEducationChange = (index: number, field: keyof ResumeEducation, val: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map((item, i) => i === index ? { ...item, [field]: val } : item)
    }))
  }

  // --- Dynamic Certifications CRUD ---
  const handleAddCertification = () => {
    setResume(prev => ({
      ...prev,
      certifications: [...prev.certifications, '']
    }))
  }
  const handleRemoveCertification = (index: number) => {
    setResume(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }
  const handleCertificationChange = (index: number, val: string) => {
    setResume(prev => ({
      ...prev,
      certifications: prev.certifications.map((item, i) => i === index ? val : item)
    }))
  }

  // --- Dynamic Achievements CRUD ---
  const handleAddAchievement = () => {
    setResume(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }))
  }
  const handleRemoveAchievement = (index: number) => {
    setResume(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }
  const handleAchievementChange = (index: number, val: string) => {
    setResume(prev => ({
      ...prev,
      achievements: prev.achievements.map((item, i) => i === index ? val : item)
    }))
  }

  // --- Dynamic Soft Skills CRUD ---
  const handleAddSoftSkill = () => {
    setResume(prev => ({
      ...prev,
      softSkills: [...prev.softSkills, { title: '', description: '' }]
    }))
  }
  const handleRemoveSoftSkill = (index: number) => {
    setResume(prev => ({
      ...prev,
      softSkills: prev.softSkills.filter((_, i) => i !== index)
    }))
  }
  const handleSoftSkillChange = (index: number, field: keyof ResumeSoftSkill, val: string) => {
    setResume(prev => ({
      ...prev,
      softSkills: prev.softSkills.map((item, i) => i === index ? { ...item, [field]: val } : item)
    }))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-[#00E5FF] mb-2" />
        <span className="font-mono text-xs uppercase tracking-wider">Synchronizing Node Data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Resume Builder
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Build and compile `/public/resume.html` statically
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchResume}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
          >
            <Save className="w-4 h-4 mr-2" />
            <span>{saving ? 'Compiling...' : 'Save & Build'}</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="flex flex-wrap h-auto bg-[#0A1020]/80 p-1 border border-slate-800 gap-1 mb-6">
          <TabsTrigger value="general" className="gap-2 font-mono text-xs uppercase py-2"><User className="w-3.5 h-3.5" />General</TabsTrigger>
          <TabsTrigger value="skills" className="gap-2 font-mono text-xs uppercase py-2"><Code2 className="w-3.5 h-3.5" />Skills</TabsTrigger>
          <TabsTrigger value="experience" className="gap-2 font-mono text-xs uppercase py-2"><Briefcase className="w-3.5 h-3.5" />Work Exp</TabsTrigger>
          <TabsTrigger value="projects" className="gap-2 font-mono text-xs uppercase py-2"><FileText className="w-3.5 h-3.5" />Projects</TabsTrigger>
          <TabsTrigger value="education" className="gap-2 font-mono text-xs uppercase py-2"><GraduationCap className="w-3.5 h-3.5" />Education</TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2 font-mono text-xs uppercase py-2"><Trophy className="w-3.5 h-3.5" />Achievements</TabsTrigger>
          <TabsTrigger value="soft" className="gap-2 font-mono text-xs uppercase py-2"><Award className="w-3.5 h-3.5" />Soft Skills</TabsTrigger>
        </TabsList>

        {/* 1. GENERAL TAB */}
        <TabsContent value="general" className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="font-display font-semibold text-white uppercase text-sm border-b border-slate-800 pb-2 mb-4 tracking-wider text-cyan-DEFAULT">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Full Name</Label>
              <Input 
                value={resume.name} 
                onChange={(e) => setResume(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Lavanya Joshi"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Contact Email</Label>
              <Input 
                value={resume.email} 
                onChange={(e) => setResume(prev => ({ ...prev, email: e.target.value }))}
                placeholder="e.g. email@example.com"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Phone Number</Label>
              <Input 
                value={resume.phone} 
                onChange={(e) => setResume(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="e.g. +91-XXXXX"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Location Address</Label>
              <Input 
                value={resume.address} 
                onChange={(e) => setResume(prev => ({ ...prev, address: e.target.value }))}
                placeholder="e.g. Dehradun, India"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">GitHub Profile URL</Label>
              <Input 
                value={resume.github} 
                onChange={(e) => setResume(prev => ({ ...prev, github: e.target.value }))}
                placeholder="https://github.com/..."
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">LinkedIn Profile URL</Label>
              <Input 
                value={resume.linkedin} 
                onChange={(e) => setResume(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/in/..."
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
            </div>
          </div>
          <div className="space-y-1.5 pt-2">
            <Label className="font-mono text-[10px] text-slate-500 uppercase">Professional Summary</Label>
            <Textarea 
              value={resume.summary} 
              onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Write a powerful description of your technical qualifications..."
              rows={6}
              className="bg-[#101827]/70 border-slate-800 text-white leading-relaxed resize-y"
            />
          </div>
        </TabsContent>

        {/* 2. TECHNICAL SKILLS TAB */}
        <TabsContent value="skills" className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <h2 className="font-display font-semibold text-white uppercase text-sm tracking-wider text-cyan-DEFAULT">Technical Skills Categories</h2>
            <Button onClick={handleAddSkill} size="sm" className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 font-mono text-[10px] uppercase">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Category
            </Button>
          </div>
          {resume.skills.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 text-center py-6">No skills categories created. Click "Add Category" to start.</p>
          ) : (
            <div className="space-y-4">
              {resume.skills.map((skill, index) => (
                <div key={index} className="flex gap-4 items-start bg-[#101827]/30 border border-slate-900 p-4 rounded-xl relative group">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Label (e.g., Frontend:)</Label>
                      <Input 
                        value={skill.label} 
                        onChange={(e) => handleSkillChange(index, 'label', e.target.value)}
                        placeholder="Frontend:"
                        className="bg-[#101827]/70 border-slate-800 text-white"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Values (Comma Separated)</Label>
                      <Input 
                        value={skill.value} 
                        onChange={(e) => handleSkillChange(index, 'value', e.target.value)}
                        placeholder="React.js, Next.js, HTML5, CSS"
                        className="bg-[#101827]/70 border-slate-800 text-white"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleRemoveSkill(index)} 
                    variant="outline" 
                    size="icon" 
                    className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-500 hover:text-red-400 self-end"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 3. WORK EXPERIENCE TAB */}
        <TabsContent value="experience" className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <h2 className="font-display font-semibold text-white uppercase text-sm tracking-wider text-cyan-DEFAULT">Work Experience</h2>
            <Button onClick={handleAddExperience} size="sm" className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 font-mono text-[10px] uppercase">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Position
            </Button>
          </div>
          {resume.experience.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 text-center py-6">No positions defined yet.</p>
          ) : (
            <div className="space-y-6">
              {resume.experience.map((exp, expIdx) => (
                <div key={expIdx} className="bg-[#101827]/30 border border-slate-900 p-5 rounded-xl space-y-4 relative group">
                  <div className="flex justify-between items-start">
                    <h3 className="font-mono text-xs text-[#00E5FF]/80 uppercase">Position #{expIdx + 1}</h3>
                    <Button 
                      onClick={() => handleRemoveExperience(expIdx)} 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Role Title</Label>
                      <Input 
                        value={exp.role} 
                        onChange={(e) => handleExperienceChange(expIdx, 'role', e.target.value)}
                        placeholder="e.g. Full‑Stack Developer"
                        className="bg-[#101827]/70 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Company / Platform</Label>
                      <Input 
                        value={exp.company} 
                        onChange={(e) => handleExperienceChange(expIdx, 'company', e.target.value)}
                        placeholder="e.g. Graphic Era Hill University"
                        className="bg-[#101827]/70 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Duration (e.g. 01/2026 – 04/2026)</Label>
                      <Input 
                        value={exp.duration} 
                        onChange={(e) => handleExperienceChange(expIdx, 'duration', e.target.value)}
                        placeholder="01/2026 – 04/2026"
                        className="bg-[#101827]/70 border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Achievements Bullets</Label>
                      <Button 
                        onClick={() => handleAddExperienceBullet(expIdx)} 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        className="border-slate-800 hover:border-[#00E5FF]/20 text-slate-400 hover:text-white text-[10px] font-mono"
                      >
                        <ListPlus className="w-3.5 h-3.5 mr-1" /> Add Bullet
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {exp.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex gap-2 items-center">
                          <Input 
                            value={bullet} 
                            onChange={(e) => handleExperienceBulletChange(expIdx, bulletIdx, e.target.value)}
                            placeholder="Describe achievement or key work deliverable..."
                            className="bg-[#101827]/70 border-slate-800 text-white flex-1"
                          />
                          <Button 
                            onClick={() => handleRemoveExperienceBullet(expIdx, bulletIdx)} 
                            variant="outline" 
                            size="icon" 
                            className="border-slate-800 hover:border-red-500/30 text-slate-500 hover:text-red-400 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 4. PROJECTS TAB */}
        <TabsContent value="projects" className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <h2 className="font-display font-semibold text-white uppercase text-sm tracking-wider text-cyan-DEFAULT">Academic & Personal Projects</h2>
            <Button onClick={handleAddProject} size="sm" className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 font-mono text-[10px] uppercase">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Project
            </Button>
          </div>
          {resume.projects.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 text-center py-6">No projects defined yet.</p>
          ) : (
            <div className="space-y-6">
              {resume.projects.map((proj, projIdx) => (
                <div key={projIdx} className="bg-[#101827]/30 border border-slate-900 p-5 rounded-xl space-y-4 relative group">
                  <div className="flex justify-between items-start">
                    <h3 className="font-mono text-xs text-[#00E5FF]/80 uppercase">Project #{projIdx + 1}</h3>
                    <Button 
                      onClick={() => handleRemoveProject(projIdx)} 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Project Title</Label>
                      <Input 
                        value={proj.title} 
                        onChange={(e) => handleProjectChange(projIdx, 'title', e.target.value)}
                        placeholder="e.g. PeriodTracker"
                        className="bg-[#101827]/70 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Technologies Used (Comma Separated)</Label>
                      <Input 
                        value={proj.technologies} 
                        onChange={(e) => handleProjectChange(projIdx, 'technologies', e.target.value)}
                        placeholder="Next.js, TypeScript, MongoDB"
                        className="bg-[#101827]/70 border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Project Bullets</Label>
                      <Button 
                        onClick={() => handleAddProjectBullet(projIdx)} 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        className="border-slate-800 hover:border-[#00E5FF]/20 text-slate-400 hover:text-white text-[10px] font-mono"
                      >
                        <ListPlus className="w-3.5 h-3.5 mr-1" /> Add Bullet
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {proj.bullets.map((bullet, bulletIdx) => (
                        <div key={bulletIdx} className="flex gap-2 items-center">
                          <Input 
                            value={bullet} 
                            onChange={(e) => handleProjectBulletChange(projIdx, bulletIdx, e.target.value)}
                            placeholder="Describe achievement or technical integration..."
                            className="bg-[#101827]/70 border-slate-800 text-white flex-1"
                          />
                          <Button 
                            onClick={() => handleRemoveProjectBullet(projIdx, bulletIdx)} 
                            variant="outline" 
                            size="icon" 
                            className="border-slate-800 hover:border-red-500/30 text-slate-500 hover:text-red-400 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 5. EDUCATION TAB */}
        <TabsContent value="education" className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <h2 className="font-display font-semibold text-white uppercase text-sm tracking-wider text-cyan-DEFAULT">Education History</h2>
            <Button onClick={handleAddEducation} size="sm" className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 font-mono text-[10px] uppercase">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Education
            </Button>
          </div>
          {resume.education.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 text-center py-6">No education history defined yet.</p>
          ) : (
            <div className="space-y-6">
              {resume.education.map((edu, index) => (
                <div key={index} className="bg-[#101827]/30 border border-slate-900 p-5 rounded-xl space-y-4 relative group">
                  <div className="flex justify-between items-start">
                    <h3 className="font-mono text-xs text-[#00E5FF]/80 uppercase">Education #{index + 1}</h3>
                    <Button 
                      onClick={() => handleRemoveEducation(index)} 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Degree & Field of Study</Label>
                      <Input 
                        value={edu.degree} 
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        placeholder="e.g. Bachelor of Technology in Computer Science Engineering"
                        className="bg-[#101827]/70 border-slate-800 text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Duration (e.g. Expected Graduation: 05/2028)</Label>
                      <Input 
                        value={edu.duration} 
                        onChange={(e) => handleEducationChange(index, 'duration', e.target.value)}
                        placeholder="Expected Graduation: 05/2028"
                        className="bg-[#101827]/70 border-slate-800 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Institution & Location</Label>
                    <Input 
                      value={edu.institution} 
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      placeholder="e.g. Graphic Era Hill University | Dehradun, Uttarakhand"
                      className="bg-[#101827]/70 border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Relevant Coursework</Label>
                    <Input 
                      value={edu.coursework} 
                      onChange={(e) => handleEducationChange(index, 'coursework', e.target.value)}
                      placeholder="Data Structures, DBMS, Web Applications..."
                      className="bg-[#101827]/70 border-slate-800 text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 6. ACHIEVEMENTS & CERTIFICATIONS TAB */}
        <TabsContent value="achievements" className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          {/* CERTIFICATIONS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <h2 className="font-display font-semibold text-white uppercase text-sm tracking-wider text-cyan-DEFAULT">Certifications</h2>
              <Button onClick={handleAddCertification} size="sm" className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 font-mono text-[10px] uppercase">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Certification
              </Button>
            </div>
            
            {resume.certifications.length === 0 ? (
              <p className="text-xs font-mono text-slate-500 text-center py-4">No certifications added.</p>
            ) : (
              <div className="space-y-2">
                {resume.certifications.map((cert, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input 
                      value={cert} 
                      onChange={(e) => handleCertificationChange(index, e.target.value)}
                      placeholder="e.g. AWS Cloud CLI Essentials"
                      className="bg-[#101827]/70 border-slate-800 text-white flex-1"
                    />
                    <Button 
                      onClick={() => handleRemoveCertification(index)} 
                      variant="outline" 
                      size="icon" 
                      className="border-slate-800 hover:border-red-500/30 text-slate-500 hover:text-red-400 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* KEY ACHIEVEMENTS SECTION */}
          <div className="space-y-4 pt-4 border-t border-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <h2 className="font-display font-semibold text-white uppercase text-sm tracking-wider text-cyan-DEFAULT">Key Achievements</h2>
              <Button onClick={handleAddAchievement} size="sm" className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 font-mono text-[10px] uppercase">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Achievement
              </Button>
            </div>
            
            {resume.achievements.length === 0 ? (
              <p className="text-xs font-mono text-slate-500 text-center py-4">No key achievements added.</p>
            ) : (
              <div className="space-y-2">
                {resume.achievements.map((ach, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input 
                      value={ach} 
                      onChange={(e) => handleAchievementChange(index, e.target.value)}
                      placeholder="Describe your award, ranking, or competitive score..."
                      className="bg-[#101827]/70 border-slate-800 text-white flex-1"
                    />
                    <Button 
                      onClick={() => handleRemoveAchievement(index)} 
                      variant="outline" 
                      size="icon" 
                      className="border-slate-800 hover:border-red-500/30 text-slate-500 hover:text-red-400 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* 7. SOFT SKILLS TAB */}
        <TabsContent value="soft" className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
            <h2 className="font-display font-semibold text-white uppercase text-sm tracking-wider text-cyan-DEFAULT">Soft Skills</h2>
            <Button onClick={handleAddSoftSkill} size="sm" className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 border border-[#00E5FF]/30 font-mono text-[10px] uppercase">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Soft Skill
            </Button>
          </div>
          
          {resume.softSkills.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 text-center py-6">No soft skills defined. Click "Add Soft Skill" to start.</p>
          ) : (
            <div className="space-y-4">
              {resume.softSkills.map((ss, index) => (
                <div key={index} className="flex gap-4 items-start bg-[#101827]/30 border border-slate-900 p-4 rounded-xl relative group">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Skill Title</Label>
                      <Input 
                        value={ss.title} 
                        onChange={(e) => handleSoftSkillChange(index, 'title', e.target.value)}
                        placeholder="e.g. Leadership"
                        className="bg-[#101827]/70 border-slate-800 text-white"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                      <Label className="font-mono text-[10px] text-slate-500 uppercase">Description</Label>
                      <Input 
                        value={ss.description} 
                        onChange={(e) => handleSoftSkillChange(index, 'description', e.target.value)}
                        placeholder="e.g. Guided project teams, ensuring timely delivery."
                        className="bg-[#101827]/70 border-slate-800 text-white"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleRemoveSoftSkill(index)} 
                    variant="outline" 
                    size="icon" 
                    className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-500 hover:text-red-400 self-end"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
