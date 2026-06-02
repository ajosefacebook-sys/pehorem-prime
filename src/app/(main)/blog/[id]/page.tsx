"use client"

import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"

const posts = [
  {
    id: "1",
    title: "The Future of Luxury Real Estate in Africa: 2025 Market Analysis",
    content: "The African luxury real estate market is experiencing unprecedented growth, driven by increasing foreign direct investment, a rising class of high-net-worth individuals, and rapid urbanization across major cities. Lagos, Nairobi, Cape Town, and Marrakech have emerged as hotspots for premium property development, attracting global investors seeking both residential and commercial opportunities.\n\nMarket data from 2024 shows a 23% increase in luxury property transactions across key African markets, with Lagos alone recording over $1.2 billion in high-end real estate sales. The demand for smart homes, sustainable architecture, and integrated security solutions has reshaped developer priorities, leading to a new generation of luxury properties that rival their European and American counterparts.\n\nLooking ahead to 2025, we anticipate continued growth driven by infrastructure improvements, regulatory reforms, and increased confidence in African real estate markets. The emergence of proptech solutions is also streamlining property transactions, making it easier for international buyers to invest in African luxury real estate remotely.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    category: "Market Insights",
    author: "PEHOREM PRIME Team",
    date: new Date("2024-12-15"),
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Top 10 Luxury SUVs Defining Automotive Excellence in 2025",
    content: "The luxury SUV segment continues to dominate the automotive landscape, blending unparalleled comfort with commanding presence and cutting-edge technology. From the Italian flair of the Lamborghini Urus to the British elegance of the Rolls-Royce Cullinan, 2025's lineup represents the pinnacle of automotive achievement.\n\nEach of these vehicles represents a unique philosophy of luxury. The Bentley Bentayga offers handcrafted interiors with over 40 different wood veneer options, while the Mercedes-Maybach GLS focuses on rear-seat luxury with airline-style reclining seats and a refrigerator compartment. Electric entries like the BMW iX and Mercedes EQS SUV prove that sustainability need not compromise luxury.\n\nPerformance-wise, the Aston Martin DBX707 leads the segment with 707 horsepower, while the Range Rover SV remains the benchmark for off-road capability wrapped in luxury. The Porsche Cayenne Turbo GT continues to blur the line between SUV and sports car, offering lap times that embarrass dedicated performance vehicles.",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b",
    category: "Automotive",
    author: "PEHOREM PRIME Team",
    date: new Date("2024-11-28"),
    readTime: "4 min read",
  },
  {
    id: "3",
    title: "How AI is Transforming the Luxury Marketplace Experience",
    content: "Artificial intelligence is fundamentally reshaping how high-net-worth individuals discover, evaluate, and acquire luxury assets. From personalized property recommendations to real-time market valuations, AI-powered tools are creating unprecedented efficiency in the luxury marketplace.\n\nPEHOREM PRIME's AI engine analyzes thousands of data points including historical transaction data, market trends, user behavior, and global economic indicators to deliver highly relevant listings. Our machine learning models predict pricing trends with 94% accuracy, helping both buyers and sellers make informed decisions.\n\nBeyond recommendations, AI is enhancing the virtual viewing experience. Computer vision technology enables virtual staging that adapts to different aesthetic preferences, while natural language processing powers our intelligent chatbot that can answer detailed queries about properties and vehicles 24/7. The result is a marketplace experience that feels intuitive, responsive, and deeply personalized.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    category: "Technology",
    author: "PEHOREM PRIME Team",
    date: new Date("2024-11-10"),
    readTime: "6 min read",
  },
  {
    id: "4",
    title: "Investment Guide: Lagos Luxury Real Estate Hotspots",
    content: "Lagos continues to be Africa's most dynamic luxury real estate market, with distinct neighborhoods offering unique investment opportunities. Understanding the character and potential of each area is crucial for making informed investment decisions.\n\nBanana Island remains the crown jewel of Lagos luxury living, with waterfront properties commanding between $3 million and $15 million. The artificial island offers unparalleled security and exclusivity, with properties featuring private docks, infinity pools, and panoramic lagoon views. Recent infrastructure improvements including the new link bridge have further enhanced accessibility.\n\nIkoyi's highland areas offer a different value proposition, with properties ranging from $1.5 million to $8 million. The neighborhood combines colonial-era charm with modern luxury developments, making it particularly attractive to diplomats and expatriates. The planned Ikoyi-Victoria Island link bridge promises to further boost property values in this area.\n\nLekki Phase 1 has emerged as a hotspot for younger affluent buyers, with prices ranging from $500,000 to $3 million. The area offers more space for your investment while maintaining proximity to Victoria Island's business district. The ongoing Lekki-Epe expressway expansion and the new Lekki Deep Sea Port are driving significant appreciation in this corridor.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    category: "Investment",
    author: "PEHOREM PRIME Team",
    date: new Date("2024-10-22"),
    readTime: "7 min read",
  },
]

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const post = posts.find((p) => p.id === id)
  if (!post) notFound()

  useEffect(() => {
    document.title = `${post.title} | PEHOREM PRIME Blog`
  }, [post])

  return (
    <section className="pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-gold text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="mb-8">
          <Badge variant="gold" className="mb-4">{post.category}</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-white/40 text-sm mt-4">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(post.date)}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
          </div>
        </div>

        <div className="relative h-[40vh] sm:h-[50vh] rounded-2xl overflow-hidden mb-10">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="100vw" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }} />
        </div>

        <div className="prose prose-invert max-w-none">
          {post.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-white/70 leading-relaxed mb-6 text-base sm:text-lg">{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
