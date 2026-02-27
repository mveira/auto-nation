import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { MobileStickyCta } from "@/components/MobileStickyCta"
import { buildAutoRepairJsonLd } from "@/lib/jsonld"

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "600", "700", "900"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "Car Nation Services - Vehicle Servicing, Repairs & MOT",
  description: "Professional vehicle servicing, repairs, and MOT testing. Trusted, transparent, and fair pricing.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = buildAutoRepairJsonLd()

  return (
    <html lang="en" className="dark">
      <head>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <Navigation />
        <main className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
        <Footer />
        <MobileStickyCta />
      </body>
    </html>
  )
}
