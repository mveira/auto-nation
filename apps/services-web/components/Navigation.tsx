"use client"

import Link from "next/link"
import { Phone, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isMobileMenuOpen])

  const navLinks = [
    { href: "/services", label: "SERVICES" },
    { href: "/book", label: "BOOK" },
    { href: "/contact", label: "CONTACT" },
  ]

  return (
    <>
      <nav className="border-b border-zinc-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center">
              <span className="font-black text-xl sm:text-2xl tracking-tight">
                CAR<span className="text-primary">NATION</span>
              </span>
              <span className="ml-2 text-xs sm:text-sm text-muted-foreground font-light hidden sm:inline">
                Services
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-primary transition-colors font-semibold tracking-wide hidden md:block"
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link href="/contact">
                <Button size="sm" className="font-bold text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">GET IN TOUCH</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-zinc-900 border-l border-zinc-800 z-[70] md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
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

                <nav className="flex flex-col p-6 gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="text-lg font-semibold hover:text-primary transition-colors tracking-wide"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto p-6 border-t border-zinc-800">
                  <Link href="/contact" onClick={closeMobileMenu}>
                    <Button className="w-full font-bold">
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
