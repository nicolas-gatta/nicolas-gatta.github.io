import { Github, Linkedin, Mail, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
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

  const containerVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.985, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.95,
        ease: [0.2, 0.75, 0.1, 1],
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.2 },
    },
  }

  const menuItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        delay: 0.45 + index * 0.11,
      },
    }),
  }

  const footerVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay: 0.95 },
    },
  }

  const fogAnimation = {
    animate: {
      opacity: [0.35, 0.5, 0.35],
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }

  const emberPulseAnimation = {
    animate: {
      scale: [1, 1.035, 1],
      filter: [
        'drop-shadow(0 0 2px rgba(198, 167, 104, 0.2))',
        'drop-shadow(0 0 12px rgba(198, 167, 104, 0.58))',
        'drop-shadow(0 0 2px rgba(198, 167, 104, 0.2))',
      ],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }

  const particleAnimations = [
    {
      animate: {
        y: [0, -30, 0],
        x: [0, 20, 0],
        opacity: [0.1, 0.15, 0.1],
      },
      transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
    },
    {
      animate: {
        y: [0, -30, 0],
        x: [0, -20, 0],
        opacity: [0.1, 0.15, 0.1],
      },
      transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
    },
    {
      animate: {
        y: [0, -30, 0],
        x: [0, 20, 0],
        opacity: [0.1, 0.15, 0.1],
      },
      transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
    },
  ]

  const linkHoverVariants = {
    cursor: { opacity: 1, x: 0 },
    icon: {
      scale: 1.08,
      filter: 'drop-shadow(0 0 8px var(--accent-color, var(--accent-gold)))',
    },
    glow: {
      opacity: 0.95,
      scale: [1, 1.3, 1],
      boxShadow: [
        '0 0 10px var(--accent-color, var(--accent-gold))',
        '0 0 20px var(--accent-color, var(--accent-gold))',
        '0 0 10px var(--accent-color, var(--accent-gold))',
      ],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <div className="container">
      {/* Animated background elements */}
      <motion.div className="fog-overlay" animate={fogAnimation.animate} transition={fogAnimation.transition}></motion.div>
      <div className="vignette-overlay"></div>
      <motion.div
        className="background-particle particle-1"
        animate={particleAnimations[0].animate}
        transition={particleAnimations[0].transition}
      ></motion.div>
      <motion.div
        className="background-particle particle-2"
        animate={particleAnimations[1].animate}
        transition={particleAnimations[1].transition}
      ></motion.div>
      <motion.div
        className="background-particle particle-3"
        animate={particleAnimations[2].animate}
        transition={particleAnimations[2].transition}
      ></motion.div>

      <motion.main
        className="content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header className="header" variants={headerVariants}>
          <h1 className="title">Undead Wanderer</h1>
          <p className="subtitle">Ashen One - Choose Your Path</p>
        </motion.header>

        {/* Links Grid */}
        <nav className="links-container">
          {links.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-item"
              custom={index}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileFocus="hover"
              style={
                {
                  '--link-color': link.color,
                } as React.CSSProperties & { '--link-color': string }
              }
            >
              <motion.span
                className="link-cursor"
                variants={{ hover: linkHoverVariants.cursor }}
                transition={{ duration: 0.25 }}
              >
                ▶
              </motion.span>
              <motion.span
                className="link-icon"
                variants={{ hover: linkHoverVariants.icon }}
                transition={{ duration: 0.3 }}
              >
                {link.icon}
              </motion.span>
              <span className="link-label">{link.label}</span>
              <motion.span
                className="link-glow"
                variants={{ hover: linkHoverVariants.glow }}
              ></motion.span>
            </motion.a>
          ))}
        </nav>

        {/* Footer */}
        <motion.footer className="footer" variants={footerVariants} initial="hidden" animate="visible">
          <p>May the darkness guide your journey</p>
          <div className="footer-divider"></div>
        </motion.footer>
      </motion.main>
    </div>
  )
}
