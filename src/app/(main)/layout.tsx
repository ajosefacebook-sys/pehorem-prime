import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { FloatingWhatsApp, MobileWhatsApp } from "@/components/layout/whatsapp"
import { Chatbot, ChatbotFAB } from "@/components/chatbot/chatbot"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <MobileWhatsApp />
      <Chatbot />
      <ChatbotFAB />
    </>
  )
}
