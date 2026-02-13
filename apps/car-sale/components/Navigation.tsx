"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav className="border-b border-zinc-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4 h-16 sm:h-20 md:h-24 lg:h-28">
            <Link href="/" className="flex items-center flex-shrink min-w-0">
              <div className="relative h-12 w-48 sm:h-16 sm:w-64 md:h-20 md:w-80 lg:h-24 lg:w-96">
                <Image
                  src="/images/car-nation.webp"
                  alt="Car Nation"
                  fill
                  className="object-contain object-left"
                  priority
                  unoptimized
                />
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-shrink-0">
              {/* Desktop Navigation */}
              <Link
                href="/inventory"
                className="hover:text-primary transition-colors font-semibold tracking-wide hidden md:block"
              >
                STOCK
              </Link>
              <Link
                href="/book"
                className="hover:text-primary transition-colors font-semibold tracking-wide hidden md:block"
              >
                BOOK
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors font-semibold tracking-wide hidden md:block"
              >
                CONTACT
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link href="/contact">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-black font-bold text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">GET IN TOUCH</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-zinc-900 border-l border-zinc-800 z-[70] md:hidden shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h2 className="text-xl font-bold text-primary">Menu</h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex flex-col p-6 gap-6">
                <Link
                  href="/inventory"
                  onClick={closeMobileMenu}
                  className="text-lg font-semibold hover:text-primary transition-colors tracking-wide"
                >
                  STOCK
                </Link>
                <Link
                  href="/book"
                  onClick={closeMobileMenu}
                  className="text-lg font-semibold hover:text-primary transition-colors tracking-wide"
                >
                  BOOK
                </Link>
                <Link
                  href="/contact"
                  onClick={closeMobileMenu}
                  className="text-lg font-semibold hover:text-primary transition-colors tracking-wide"
                >
                  CONTACT
                </Link>
              </nav>

              {/* Menu Footer */}
              <div className="mt-auto p-6 border-t border-zinc-800">
                <Link href="/contact" onClick={closeMobileMenu}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold">
                    <Phone className="h-4 w-4 mr-2" />
                    GET IN TOUCH
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>
    </>
  )
}
