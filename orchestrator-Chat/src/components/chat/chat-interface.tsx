"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Send, LogOut } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/firebase/firebaseconfig"
import { useAuthContext } from "@/hooks/AuthContext"

interface Message {
  id: number
  user: string
  text: string
}

export function ChatInterface() {
  const navigate = useNavigate()
  const { dispatch } = useAuthContext()
  const { toast } = useToast()

  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, user: "You", text: input.trim() },
      ])
      setInput("")
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      dispatch({ type: "LOGOUT" })
      navigate("/")
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="flex justify-between items-center p-4 border-b">
        <h2 className="text-2xl font-bold">Welcome to the Chatroom</h2>
        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-full p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start mb-4",
                message.user === "You" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-2 max-w-[70%]",
                  message.user === "You"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="font-bold">{message.user}:</p>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

