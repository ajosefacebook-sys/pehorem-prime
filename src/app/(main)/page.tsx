import { HeroSection } from "@/components/home/hero"
import { FeaturedProperties } from "@/components/home/featured-properties"
import { FeaturedVehicles } from "@/components/home/featured-vehicles"
import { StatsSection } from "@/components/home/stats"
import { TestimonialsSection } from "@/components/home/testimonials"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <hr className="gold-hr" />
      <FeaturedProperties />
      <hr className="gold-hr" />
      <FeaturedVehicles />
      <hr className="gold-hr" />
      <StatsSection />
      <hr className="gold-hr" />
      <TestimonialsSection />
    </>
  )
}
