import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function MobileStickyCta() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-zinc-800 bg-black/90 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Get a Quote
        </Link>
        <Link href="/book" className="flex-1 max-w-[200px]">
          <Button size="sm" className="w-full font-bold">
            Book a Service
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
