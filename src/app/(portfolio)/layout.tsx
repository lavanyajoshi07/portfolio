import ParticleCanvas from './components/shared/ParticleCanvas'
import ChatWidget from './components/chat/ChatWidget'
import Navbar from './components/shared/Navbar'
import SplashScreen from './components/shared/SplashScreen'
import VideoAvatar from './components/shared/VideoAvatar'
import AudioPlayer from './components/shared/AudioPlayer'
import { getSiteSettings } from '@/lib/site-settings' // adjust import if needed

export default async function PortfolioLayout({ children }: { children: React.ReactNode }) {
  // Load settings from DB
  const siteSettings = await getSiteSettings()

  // Splash is on by default; only disabled when explicitly turned off in settings.
  const splashEnabled = siteSettings?.splashEnabled !== false

  return (
    <>
      {/* Splash screen unless explicitly disabled */}
      {splashEnabled && <SplashScreen enabled={splashEnabled} />}

      {/* Animated background only if enabled */}
      {siteSettings?.animatedBgEnabled && <ParticleCanvas />}

      <div className="relative z-10">
        <Navbar />

        {/* Video avatar only if enabled */}
        {siteSettings?.videoAvatarEnabled && <VideoAvatar />}

        <main>{children}</main>

        {/* Audio player only if enabled */}
        {siteSettings?.audioPlayerEnabled && <AudioPlayer />}
      </div>

      <ChatWidget />
    </>
  )
}
