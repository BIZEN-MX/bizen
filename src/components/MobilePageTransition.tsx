"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface MobilePageTransitionProps {
  children: React.ReactNode
}

/**
 * Mobile Page Transition Component
 * Provides smooth page transitions on mobile devices
 */
export default function MobilePageTransition({ children }: MobilePageTransitionProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Only apply transitions on mobile
  if (!isMobile) {
    return <>{children}</>
  }

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] // Custom easing for smooth animation
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1]
      }
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        style={{
          width: '100%',
          minHeight: '100%'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

