import Link from "next/link"

const isProd = process.env.NODE_ENV === "production"

const bizPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE
const bizStreet = process.env.NEXT_PUBLIC_BUSINESS_STREET
const bizCity = process.env.NEXT_PUBLIC_BUSINESS_CITY
const bizPostcode = process.env.NEXT_PUBLIC_BUSINESS_POSTCODE

const phone = bizPhone ?? (isProd ? null : "07700 900123")
const street = bizStreet ?? (isProd ? null : "123 Fishponds Road")
const city = bizCity ?? (isProd ? null : "Fishponds, Bristol")
const postcode = bizPostcode ?? (isProd ? null : "BS16 3AN")

const hasAddress = street && city && postcode

function phoneTelHref(raw: string) {
  return `tel:${raw.replace(/\s+/g, "")}`
}

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
          {(hasAddress || phone) && (
            <div>
              <h4 className="font-bold mb-4 tracking-wide">CONTACT</h4>
              {hasAddress && (
                <p className="text-sm text-zinc-400 mb-3">
                  {street}<br />
                  {city}<br />
                  {postcode}
                </p>
              )}
              {phone && (
                <a href={phoneTelHref(phone)} className="text-sm text-zinc-400 hover:text-primary transition-colors">
                  {phone}
                </a>
              )}
            </div>
          )}
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
