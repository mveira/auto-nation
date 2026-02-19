import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "600", "700", "900"] })

export const metadata: Metadata = {
  title: "Car Nation Services - Vehicle Servicing, Repairs & MOT",
  description: "Professional vehicle servicing, repairs, and MOT testing. Trusted, transparent, and fair pricing.",
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
        <Footer />
      </body>
    </html>
  )
}
