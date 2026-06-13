import ParticleCanvas from './components/shared/ParticleCanvas'
import ChatWidget from './components/chat/ChatWidget'
import Navbar from './components/shared/Navbar'

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ParticleCanvas />
      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
      </div>
      <ChatWidget />
    </>
  )
}