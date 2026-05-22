import { HeroSection } from "@/components/home/hero"
import { FeaturedProperties } from "@/components/home/featured-properties"
import { FeaturedVehicles } from "@/components/home/featured-vehicles"
import { StatsSection } from "@/components/home/stats"
import { TestimonialsSection } from "@/components/home/testimonials"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <FeaturedVehicles />
      <StatsSection />
      <TestimonialsSection />
    </>
  )
}
