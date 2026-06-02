import type { Metadata } from "next"
import { Raleway, Cormorant_Garamond } from "next/font/google"
import "./globals.css"

const raleway = Raleway({
  variable: "--font-body",
  subsets: ["latin"],
})

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://pehorem-prime.vercel.app"),
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
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "PEHOREM PRIME | Luxury Properties & Premium Vehicles Marketplace",
    description: "AI-Powered Global Luxury Marketplace",
    type: "website",
    images: [{ url: "/logo.png", width: 512, height: 512 }],
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
      className={`${raleway.variable} ${cormorant.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-dark text-white antialiased">
        {children}
      </body>
    </html>
  )
}
