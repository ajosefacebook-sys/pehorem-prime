import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { FloatingWhatsApp, MobileWhatsApp } from "@/components/layout/whatsapp"
import { Chatbot, ChatbotFAB } from "@/components/chatbot/chatbot"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "PEHOREM PRIME | Luxury Properties & Premium Vehicles Marketplace",
  description:
    "The world's most sophisticated AI-powered marketplace for luxury properties, premium vehicles, and elite investments. Discover extraordinary real estate and exclusive automobiles.",
  keywords: [
    "luxury marketplace",
    "real estate",
    "premium vehicles",
    "luxury properties",
    "Nigeria real estate",
    "Lagos properties",
    "luxury cars",
    "property marketplace",
    "car marketplace",
    "PEHOREM PRIME",
  ],
  openGraph: {
    title: "PEHOREM PRIME | Luxury Properties & Premium Vehicles Marketplace",
    description: "AI-Powered Global Luxury Marketplace",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-dark text-white antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <MobileWhatsApp />
        <Chatbot />
        <ChatbotFAB />
      </body>
    </html>
  )
}
