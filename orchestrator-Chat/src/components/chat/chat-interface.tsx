"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Send, LogOut, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/firebase/firebaseconfig";
import { ref, onValue, push, set, remove } from "firebase/database";
import { useAuthContext } from "@/hooks/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sidebar } from "./sidebar";

interface Message {
  id: string;
  user: string;
  text: string;
}

interface Chatroom {
  id: string;
  name: string;
}

export function ChatInterface() {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [chatrooms, setChatrooms] = React.useState<Chatroom[]>([]);
  const [currentChatroom, setCurrentChatroom] = React.useState<string>("");

  React.useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const chatroomsRef = ref(db, `users/${user.uid}/chatrooms`);
    const unsubscribe = onValue(chatroomsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedChatrooms: Chatroom[] = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setChatrooms(loadedChatrooms);

      if (loadedChatrooms.length && !currentChatroom) {
        setCurrentChatroom(loadedChatrooms[0].id);
      }
    });

    return () => unsubscribe();
  }, [currentChatroom]);

  React.useEffect(() => {
    if (!currentChatroom) return;

    const messagesRef = ref(db, `chatrooms/${currentChatroom}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages: Message[] = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [currentChatroom]);

  const handleSendMessage = async () => {
    const user = auth.currentUser;
    if (!user) return;
  
    if (!input.trim()) {
      toast({
        title: "Empty message",
        description: "You cannot send an empty message.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      let chatroomId = currentChatroom;
  
      // Create a new chatroom if none exists
      if (!currentChatroom) {
        const newChatroom = {
          name: `Chatroom ${chatrooms.length + 1}`,
        };
        chatroomId = `chatroom_${Date.now()}`;
  
        await set(ref(db, `users/${user.uid}/chatrooms/${chatroomId}`), newChatroom);
        await set(ref(db, `chatrooms/${chatroomId}`), { id: chatroomId, messages: {} });
  
        setCurrentChatroom(chatroomId);
        setChatrooms((prev) => [...prev, { id: chatroomId, name: newChatroom.name }]);
      }
  
      // Add user message to the chatroom
      const messagesRef = ref(db, `chatrooms/${chatroomId}/messages`);
      await push(messagesRef, {
        user: user.displayName || user.email || "Anonymous",
        text: input.trim(),
      });
  
      // Set a predefined response from the System
      const responses = [
        "Hello! How can I help you today?",
        "Hi there! What's on your mind?",
        "Goodbye for now! Have a great day!",
        "How are you doing today?",
        "I'm here if you need any help!",
      ];
  
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
      // Add system's random response to the chatroom
      await push(messagesRef, {
        user: "System",
        text: randomResponse,
      });
  
      // Clear input field after sending
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message failed",
        description: "Could not send the message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddChatroom = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const newChatroom = {
      name: `Chatroom ${chatrooms.length + 1}`,
    };

    try {
      const chatroomId = `chatroom_${Date.now()}`;
      await set(ref(db, `users/${user.uid}/chatrooms/${chatroomId}`), newChatroom);
      await set(ref(db, `chatrooms/${chatroomId}`), { id: chatroomId, messages: {} });

      setCurrentChatroom(chatroomId);
    } catch (error) {
      console.error("Error creating chatroom:", error);
      toast({
        title: "Chatroom creation failed",
        description: "Could not create the chatroom. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChatroom = async (chatroomId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await remove(ref(db, `users/${user.uid}/chatrooms/${chatroomId}`));
      await remove(ref(db, `chatrooms/${chatroomId}`));

      if (currentChatroom === chatroomId) {
        setCurrentChatroom(chatrooms[0]?.id || "");
      }

      toast({
        title: "Chatroom deleted",
        description: "The chatroom has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting chatroom:", error);
      toast({
        title: "Chatroom deletion failed",
        description: "Could not delete the chatroom. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch({ type: "LOGOUT" });
      navigate("/");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-200 dark:from-purple-900 dark:via-pink-900 dark:to-indigo-800">
      <Sidebar
        chatrooms={chatrooms}
        currentChatroom={currentChatroom}
        onSelectChatroom={setCurrentChatroom}
        onAddChatroom={handleAddChatroom}
        onDeleteChatroom={handleDeleteChatroom}
      />
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md">
          <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {chatrooms.find((room) => room.id === currentChatroom)?.name || "Chat Interface"}
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src={auth.currentUser?.photoURL || undefined} alt="User avatar" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2">
                <p className="font-bold text-purple-600 dark:text-purple-400">
                  {auth.currentUser?.displayName || "Anonymous"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {auth.currentUser?.email}
                </p>
              </div>
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-hidden bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
          <ScrollArea className="h-full p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex mb-4",
                  message.user === auth.currentUser?.displayName
                    ? "justify-end"
                    : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[75%] px-4 py-2 rounded-lg text-sm shadow-md",
                    message.user === auth.currentUser?.displayName
                      ? "bg-purple-500 text-white"
                      : "bg-indigo-100 text-gray-800 dark:bg-indigo-900 dark:text-gray-200"
                  )}
                >
                  <p className="font-bold text-xs mb-1">{message.user}</p>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </main>
        <footer className="flex items-center p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSendMessage}
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </footer>
      </div>
    </div>
  );
}
