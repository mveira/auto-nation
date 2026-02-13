import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
        <h1 className="text-9xl font-black mb-6 text-primary tracking-tighter">404</h1>
        <h2 className="text-4xl font-black mb-4 tracking-tight">PAGE NOT FOUND</h2>
        <p className="text-zinc-400 mb-10 text-lg">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link href="/">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold">
            <Home className="mr-2 h-5 w-5" />
            BACK TO HOME
          </Button>
        </Link>
      </div>
    </div>
  )
}
