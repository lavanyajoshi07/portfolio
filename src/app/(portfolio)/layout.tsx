import ParticleCanvas from './_components/shared/ParticleCanvas'
import ChatWidget from './_components/chat/ChatWidget'
import Navbar from './_components/shared/Navbar'

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