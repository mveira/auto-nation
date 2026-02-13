"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeInSection({ children, delay = 0, className = "" }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { duration: 0.5, ease: "easeOut" }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScaleOnHover({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function GlowPulse({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 20px rgba(255, 215, 0, 0.3)",
          "0 0 40px rgba(255, 215, 0, 0.6)",
          "0 0 20px rgba(255, 215, 0, 0.3)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
