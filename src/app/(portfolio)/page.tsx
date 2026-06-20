import { Suspense } from 'react'
import HeroSection from './components/hero/HeroSection'
import AboutSection from './components/about/AboutSection'
import SkillsSection from './components/skills/SkillsSection'
import ProjectsSection from './components/projects/ProjectsSection'
import CodingDashboard from './components/coding/CodingDashboard'
import CertificationsSection from './components/certifications/CertificationSection'
import AchievementsSection from './components/achievements/AchievementsSection'
import ContactSection from './components/contact/ContactSection'

// Import newly integrated custom CMS sections
import Footer from './components/shared/Footer'

import SectionLoader from './components/shared/SectionLoader'
import connectDB from '@/lib/db'
import { 
  Profile, 
  TechStackSettings,
  TechnologyCategory,
  Technology,
  TechStats,
  Project, 
  Certification, 
  Achievement, 
  AchievementCategory,
  AchievementSettings,
  SiteSettings,
  CodingActivitySettings,
  Resume
} from '@/models'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function getData() {
  try {
    await connectDB()
    const [
      profile, 
      techStackSettings,
      techStackCategories,
      technologies,
      techStats,
      projects, 
      certifications, 
      achievements, 
      achievementCategories,
      achievementSettings,
      settings,
      codingActivitySettings,
      resume
    ] = await Promise.all([
      Profile.findOne().lean(),
      TechStackSettings.findOne().lean(),
      TechnologyCategory.find({ deletedAt: null }).sort({ order: 1 }).lean(),
      Technology.find({ deletedAt: null }).sort({ displayOrder: 1 }).lean(),
      TechStats.find({ deletedAt: null }).sort({ order: 1 }).lean(),
      Project.find().sort({ featured: -1, order: 1 }).lean(),
      Certification.find().sort({ sortOrder: 1 }).lean(),
      Achievement.find({ deletedAt: null }).populate('category').sort({ featured: -1, displayOrder: 1, date: -1 }).lean(),
      AchievementCategory.find({ deletedAt: null }).sort({ displayOrder: 1 }).lean(),
      AchievementSettings.findOne().lean(),
      SiteSettings.findOne().lean(),
      CodingActivitySettings.findOne().lean(),
      Resume.findOne().lean()
    ])

    const finalSettings = achievementSettings || {
      title: 'ACHIEVEMENTS & AWARDS',
      subtitle: 'Recognitions, competitions, memberships, and engineering milestones.',
      showCategoryGrid: true,
      animationsEnabled: true,
    }

    return {
      profile: JSON.parse(JSON.stringify(profile)),
      techStackSettings: JSON.parse(JSON.stringify(techStackSettings)),
      techStackCategories: JSON.parse(JSON.stringify(techStackCategories)),
      technologies: JSON.parse(JSON.stringify(technologies)),
      techStats: JSON.parse(JSON.stringify(techStats)),
      projects: JSON.parse(JSON.stringify(projects)),
      certifications: JSON.parse(JSON.stringify(certifications)),
      achievements: JSON.parse(JSON.stringify(achievements)),
      achievementCategories: JSON.parse(JSON.stringify(achievementCategories)),
      achievementSettings: JSON.parse(JSON.stringify(finalSettings)),
      settings: JSON.parse(JSON.stringify(settings)),
      codingActivitySettings: JSON.parse(JSON.stringify(codingActivitySettings)),
      resume: JSON.parse(JSON.stringify(resume))
    }
  } catch (error) {
    console.error('Error fetching portfolio data:', error)
    return {
      profile: null,
      techStackSettings: null,
      techStackCategories: [],
      technologies: [],
      techStats: [],
      projects: [],
      certifications: [],
      achievements: [],
      achievementCategories: [],
      achievementSettings: {
        title: 'ACHIEVEMENTS & AWARDS',
        subtitle: 'Recognitions, competitions, memberships, and engineering milestones.',
        showCategoryGrid: true,
        animationsEnabled: true,
      },
      settings: null,
      codingActivitySettings: null,
      resume: null
    }
  }
}

export default async function PortfolioPage() {
  const data = await getData()
  const { 
    profile, 
    techStackSettings,
    techStackCategories,
    technologies,
    techStats,
    projects, 
    certifications, 
    achievements, 
    achievementCategories,
    achievementSettings,
    settings,
    codingActivitySettings,
    resume
  } = data

  const activeCategories = (techStackCategories || []).filter((c: any) => c.active !== false)
  const activeTechnologies = (technologies || []).filter((t: any) => t.active !== false)
  const activeStats = (techStats || []).filter((s: any) => s.active !== false)
  
  // Featured projects has the highest priority. Sort them with featured first, then by order, then by priority.
  const enabledProjects = projects
    .filter((p: any) => p.publishStatus === 'published' && p.showOnHomepage !== false)
    .sort((a: any, b: any) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1
      }
      return (a.sortOrder || 0) - (b.sortOrder || 0)
    })

  const enabledCerts = certifications.filter((c: any) => c.isPublished !== false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Hero */}
      <Suspense fallback={<SectionLoader />}>
        <HeroSection profile={profile} />
      </Suspense>

      {/* 3. About Me */}
      <Suspense fallback={<SectionLoader />}>
        <AboutSection profile={profile} education={resume?.education || []} />
      </Suspense>

      {/* 4. Featured Projects */}
      {enabledProjects.length > 0 && (
        <Suspense fallback={<SectionLoader />}>
          <ProjectsSection projects={enabledProjects} />
        </Suspense>
      )}

      {/* 5. Tech Stack */}
      {activeTechnologies.length > 0 && (
        <Suspense fallback={<SectionLoader />}>
          <SkillsSection 
            settings={techStackSettings}
            categories={activeCategories}
            technologies={activeTechnologies}
            stats={activeStats}
          />
        </Suspense>
      )}

      {/* 6. Certifications */}
      {enabledCerts.length > 0 && (
        <Suspense fallback={<SectionLoader />}>
          <CertificationsSection certifications={enabledCerts} />
        </Suspense>
      )}

      {/* 7. Coding Activity */}
      <Suspense fallback={<SectionLoader />}>
        <CodingDashboard 
          dashboardSettings={codingActivitySettings}
        />
      </Suspense>

      {/* 8. Achievements */}
      <Suspense fallback={<SectionLoader />}>
        <AchievementsSection 
          achievements={achievements} 
          categories={achievementCategories}
          settings={achievementSettings}
        />
      </Suspense>

      {/* 11. Contact */}
      <Suspense fallback={<SectionLoader />}>
        <ContactSection profile={profile} />
      </Suspense>

      {/* 12. Footer */}
      <Footer profile={profile} copyrightText={settings?.copyrightText} />
    </div>
  )
}

