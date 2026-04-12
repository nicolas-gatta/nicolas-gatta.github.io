import { Github, Linkedin, Mail, Phone } from 'lucide-react'
import './App.css'

interface LinkItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  color: string
}

export default function App() {
  const links: LinkItem[] = [
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/nicolas-gatta',
      icon: <Github size={24} />,
      color: '#D4AF37', // Gold
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/nicolas-gatta',
      icon: <Linkedin size={24} />,
      color: '#D4AF37',
    },
    {
      id: 'email-professional',
      label: 'Email (Professional)',
      href: 'mailto:nicolas.gatta-cic@ibm.com',
      icon: <Mail size={24} />,
      color: '#A7795D', // Bronze
    },
    {
      id: 'email-personal',
      label: 'Email (Personal)',
      href: 'mailto:nicolasgatta1@gmail.com',
      icon: <Mail size={24} />,
      color: '#A7795D',
    },
    {
      id: 'phone-professional',
      label: 'Phone (Professional)',
      href: 'tel:+32492742521',
      icon: <Phone size={24} />,
      color: '#8B7355', // Dark bronze
    },
        {
      id: 'phone-personal',
      label: 'Phone (Personal)',
      href: 'tel:+32479837036',
      icon: <Phone size={24} />,
      color: '#8B7355', // Dark bronze
    },
  ]

  return (
    <div className="container">
      {/* Animated background elements */}
      <div className="background-particle particle-1"></div>
      <div className="background-particle particle-2"></div>
      <div className="background-particle particle-3"></div>

      <main className="content">
        {/* Header */}
        <header className="header">
          <div className="profile-icon">⚔️</div>
          <h1 className="title">Undead Wanderer</h1>
          <p className="subtitle">Chosen One Link To Guide you in your journey</p>
        </header>

        {/* Links Grid */}
        <nav className="links-container">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-item"
              style={
                {
                  '--link-color': link.color,
                } as React.CSSProperties & { '--link-color': string }
              }
            >
              <span className="link-icon">{link.icon}</span>
              <span className="link-label">{link.label}</span>
              <span className="link-glow"></span>
            </a>
          ))}
        </nav>

        {/* Footer */}
        <footer className="footer">
          <p>May the darkness guide your journey</p>
          <div className="footer-divider"></div>
        </footer>
      </main>
    </div>
  )
}
