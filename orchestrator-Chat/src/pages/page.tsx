"use client"

import { ChatInterface } from "@/components/chat/chat-interface"
import { ThemeProvider } from "@/components/ui/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-screen dark:bg-gray-900">
        <ChatInterface />
      </div>
    </ThemeProvider>
  )
}

