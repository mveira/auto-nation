import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-black text-xl mb-4 tracking-tight">
              CAR<span className="text-primary">NATION</span>
              <span className="text-sm font-light text-muted-foreground ml-2">Services</span>
            </h3>
            <p className="text-zinc-400 text-sm font-light">
              Professional vehicle servicing, repairs, and MOT testing.
              Trusted, transparent, and fair.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 tracking-wide">QUICK LINKS</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/services" className="hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link href="/book" className="hover:text-primary transition-colors">Book Online</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            {/* TODO: Replace with real business address and phone */}
            <h4 className="font-bold mb-4 tracking-wide">CONTACT</h4>
            <p className="text-sm text-zinc-400 mb-3">
              123 Fishponds Road<br />
              Fishponds, Bristol<br />
              BS16 3AN
            </p>
            <p className="text-sm text-zinc-400">
              07700 900123
            </p>
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-8 text-center">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} Car Nation Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
