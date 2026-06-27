import ParticleCanvas from './components/shared/ParticleCanvas'
import Navbar from './components/shared/Navbar'
import SplashScreen from './components/shared/SplashScreen'
import { getSiteSettings, getProfile } from '@/lib/site-settings' // adjust import if needed

export const revalidate = 60

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  // Load settings and profile from DB
  const [siteSettings, rawProfile] = await Promise.all([
    getSiteSettings(),
    getProfile()
  ])

  const profile = rawProfile ? JSON.parse(JSON.stringify(rawProfile)) : null

  // Splash is on by default; only disabled when explicitly turned off in settings.
  const splashEnabled = siteSettings?.splashEnabled !== false

  return (
    <>
      {/* Splash screen unless explicitly disabled */}
      {splashEnabled && <SplashScreen enabled={splashEnabled} />}

      {/* Animated background only if enabled */}
      {siteSettings?.animatedBgEnabled && <ParticleCanvas />}

      <div className="relative z-10">
        <Navbar profile={profile} />

        <main>{children}</main>
      </div>
    </>
  )
}
