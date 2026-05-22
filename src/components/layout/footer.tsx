import Link from "next/link"
import { Building2, Car, Phone, Mail, MapPin, Globe, ArrowUpRight } from "lucide-react"

const footerLinks = {
  marketplace: [
    { label: "Properties", href: "/properties" },
    { label: "Vehicles", href: "/vehicles" },
    { label: "Land Sales", href: "/properties?type=land" },
    { label: "Rentals", href: "/properties?type=rental" },
    { label: "Commercial", href: "/properties?type=commercial" },
    { label: "Luxury Cars", href: "/vehicles?type=luxury" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Report Issue", href: "/report" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-dark-100 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                <span className="text-black font-bold text-sm">P</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white">PEHOREM</span>
                <span className="text-lg font-bold text-gold">PRIME</span>
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              The world&apos;s most sophisticated marketplace for luxury properties and premium vehicles. Powered by AI.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, Globe, Globe, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-gold hover:bg-gold/10 border border-white/5 hover:border-gold/30 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Marketplace</h3>
            <ul className="space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/40 hover:text-gold text-sm transition-colors flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/40 hover:text-gold text-sm transition-colors flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/40 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-gold/60" />
                Victoria Island, Lagos, Nigeria
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <Phone className="w-4 h-4 text-gold/60" />
                +234 800 PEHOREM
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <Mail className="w-4 h-4 text-gold/60" />
                hello@pehoremprime.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} PEHOREM PRIME. All rights reserved.</p>
          <p className="text-white/20 text-xs">Luxury Properties &amp; Premium Vehicles Marketplace</p>
        </div>
      </div>
    </footer>
  )
}
