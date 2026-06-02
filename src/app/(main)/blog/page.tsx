"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardImage, CardContent } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { formatDate } from "@/lib/utils"

const posts = [
  {
    id: "1",
    title: "The Future of Luxury Real Estate in Africa: 2025 Market Analysis",
    excerpt: "Exploring the unprecedented growth and investment opportunities in Africa's premium property markets.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    category: "Market Insights",
    author: "PEHOREM PRIME Team",
    date: new Date("2024-12-15"),
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Top 10 Luxury SUVs Defining Automotive Excellence in 2025",
    excerpt: "From the Lamborghini Urus to the Rolls-Royce Cullinan, explore the pinnacle of SUV luxury.",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
    category: "Automotive",
    author: "PEHOREM PRIME Team",
    date: new Date("2024-11-28"),
    readTime: "4 min read",
  },
  {
    id: "3",
    title: "How AI is Transforming the Luxury Marketplace Experience",
    excerpt: "Discover how artificial intelligence is revolutionizing the way we buy and sell premium assets.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    category: "Technology",
    author: "PEHOREM PRIME Team",
    date: new Date("2024-11-10"),
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "Investment Guide: Lagos Luxury Real Estate Hotspots",
    excerpt: "A comprehensive analysis of the most promising luxury property investment areas in Lagos.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    category: "Investment",
    author: "PEHOREM PRIME Team",
    date: new Date("2024-10-22"),
    readTime: "7 min read",
  },
]

export default function BlogPage() {
  return (
    <>
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="gold" className="mb-4">Our Blog</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight max-w-4xl mx-auto">
              Luxury Market{" "}
              <span className="text-gradient">Insights & Stories</span>
            </h1>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Expert analysis, market trends, and stories from the world of luxury properties and premium automobiles.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/blog/${post.id}`}>
                <Card>
                  <CardImage className="h-48 sm:h-56">
                    <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="gold">{post.category}</Badge>
                    </div>
                  </CardImage>
                  <CardContent>
                    <div className="flex items-center gap-4 text-white/40 text-xs mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(post.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2 leading-snug">{post.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-gold text-sm font-medium">
                      Read Article <ArrowRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  )
}
