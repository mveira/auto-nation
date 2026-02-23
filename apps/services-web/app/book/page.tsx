import type { Metadata } from "next"
import { Suspense } from "react"
import BookClient from "./BookClient"

export const metadata: Metadata = {
  title: "Book a Service - Car Nation Services",
  description: "Book your vehicle service, MOT, or repair online. We'll confirm your appointment and pricing.",
}

export default function BookPage() {
  return (
    <Suspense>
      <BookClient />
    </Suspense>
  )
}
