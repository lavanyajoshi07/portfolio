import { Suspense } from 'react'
import HeroSection from './_components/hero/HeroSection'
import AboutSection from './_components/about/AboutSection'
import SkillsSection from './_components/skills/SkillsSection'
import ProjectsSection from './_components/projects/ProjectsSection'
import CodingDashboard from './_components/coding/CodingDashboard'
import TimelineSection from './_components/timeline/TimelineSection'
import CertificationsSection from './_components/certifications/CertificationsSection'
import AchievementsSection from './_components/achievements/AchievementsSection'
import ContactSection from './_components/contact/ContactSection'
import SectionLoader from './_components/shared/SectionLoader'
import connectDB from '@/lib/db'
import { Profile, Skill, Project, CodingProfile, Timeline, Certification, Achievement, SiteSettings } from '@/models'

export const revalidate = 60 // ISR: revalidate every 60s

async function getData() {
  await connectDB()
  const [profile, skills, projects, codingProfiles, timeline, certifications, achievements, settings] =
    await Promise.all([
      Profile.findOne().lean(),
      Skill.find().sort({ order: 1 }).lean(),
      Project.find({ status: { $ne: 'archived' } }).sort({ featured: -1, order: 1 }).lean(),
      CodingProfile.find({ enabled: true }).lean(),
      Timeline.find().sort({ order: 1 }).lean(),
      Certification.find().sort({ order: 1 }).lean(),
      Achievement.find().sort({ order: 1 }).lean(),
      SiteSettings.findOne().lean(),
    ])

  return {
    profile: JSON.parse(JSON.stringify(profile)),
    skills: JSON.parse(JSON.stringify(skills)),
    projects: JSON.parse(JSON.stringify(projects)),
    codingProfiles: JSON.parse(JSON.stringify(codingProfiles)),
    timeline: JSON.parse(JSON.stringify(timeline)),
    certifications: JSON.parse(JSON.stringify(certifications)),
    achievements: JSON.parse(JSON.stringify(achievements)),
    settings: JSON.parse(JSON.stringify(settings)),
  }
}

export default async function PortfolioPage() {
  const { profile, skills, projects, codingProfiles, timeline, certifications, achievements } =
    await getData()

  return (
    <div className="min-h-screen">
      <Suspense fallback={<SectionLoader />}>
        <HeroSection profile={profile} />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <AboutSection profile={profile} />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <SkillsSection skills={skills} />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ProjectsSection projects={projects} />
      </Suspense>

      {codingProfiles?.length > 0 && (
        <Suspense fallback={<SectionLoader />}>
          <CodingDashboard profiles={codingProfiles} />
        </Suspense>
      )}

      {timeline?.length > 0 && (
        <Suspense fallback={<SectionLoader />}>
          <TimelineSection items={timeline} />
        </Suspense>
      )}

      {certifications?.length > 0 && (
        <Suspense fallback={<SectionLoader />}>
          <CertificationsSection certifications={certifications} />
        </Suspense>
      )}

      {achievements?.length > 0 && (
        <Suspense fallback={<SectionLoader />}>
          <AchievementsSection achievements={achievements} />
        </Suspense>
      )}

      <Suspense fallback={<SectionLoader />}>
        <ContactSection />
      </Suspense>
    </div>
  )
}