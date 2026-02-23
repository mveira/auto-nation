import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - Car Nation Services",
  description: "Get in touch with Car Nation Services in Fishponds, Bristol. Send us a message, request a quote, or ask about our servicing and repairs.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
