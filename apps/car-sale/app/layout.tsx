import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/Navigation"
import { siteSettings } from "@/lib/siteSettings"

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "600", "700", "900"] })

export const metadata: Metadata = {
  title: "Car Nation - Quality Used Cars & Vans",
  description: "Specialising in quality used cars and vans for all needs. Full range of vehicles with warranty included.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Navigation />
        <main>{children}</main>
        <footer className="bg-black border-t border-zinc-800 text-white py-12 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-black text-xl mb-4 tracking-tight">CAR<span className="text-primary">NATION</span></h3>
                <p className="text-zinc-400 text-sm font-light">
                  Quality used cars and vans for every journey. Trusted service since 1999.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4 tracking-wide">QUICK LINKS</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li><a href="/inventory" className="hover:text-primary transition-colors">Current Stock</a></li>
                  <li><a href="https://wa.me/447700900123" className="hover:text-primary transition-colors">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 tracking-wide">CONTACT</h4>
                <p className="text-sm text-zinc-400 mb-3">
                  123 Fishponds Road<br />
                  Fishponds, Bristol<br />
                  BS16 3AN
                </p>
                <p className="text-sm text-zinc-400">
                  📱 07700 900123
                </p>
              </div>
            </div>
            <div className="border-t border-zinc-800 pt-8 text-center">
              <p className="text-zinc-500 text-sm">
                &copy; {new Date().getFullYear()} Car Nation. All rights reserved.
              </p>
              <p className="text-xs text-zinc-600 mt-2">
                {siteSettings.yearsInBusiness} years of trusted service
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
