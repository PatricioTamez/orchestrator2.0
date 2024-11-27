"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Send, LogOut, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/firebase/firebaseconfig";
import { ref, onValue, push, set } from "firebase/database";
import { useAuthContext } from "@/hooks/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

    // Fetch chatrooms for the user
    const chatroomsRef = ref(db, `users/${user.uid}/chatrooms`);
    const unsubscribe = onValue(chatroomsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedChatrooms: Chatroom[] = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setChatrooms(loadedChatrooms);

      // Automatically select the first chatroom if none is selected
      if (loadedChatrooms.length && !currentChatroom) {
        setCurrentChatroom(loadedChatrooms[0].id);
      }
    });

    return () => unsubscribe();
  }, [currentChatroom]);

  React.useEffect(() => {
    if (!currentChatroom) return;

    // Fetch messages for the selected chatroom
    const messagesRef = ref(db, `chatrooms/${currentChatroom}`);
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
    if (!user || !input.trim() || !currentChatroom) return;

    const newMessage = {
      user: user.displayName || user.email || "Anonymous",
      text: input.trim(),
    };

    try {
      const chatroomRef = ref(db, `chatrooms/${currentChatroom}`);
      await push(chatroomRef, newMessage);
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
      setCurrentChatroom(chatroomId); // Automatically switch to the new chatroom
    } catch (error) {
      console.error("Error creating chatroom:", error);
      toast({
        title: "Chatroom creation failed",
        description: "Could not create the chatroom. Please try again.",
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
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
        {/* Header */}
        <CardHeader className="flex justify-between items-center p-4 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full absolute top-4 right-4">
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
                <p className="font-bold">{auth.currentUser?.displayName || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">{auth.currentUser?.email}</p>
              </div>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <h2 className="text-2xl font-bold">Chat Interface</h2>
        </CardHeader>

        {/* Chatroom Selector */}
        <div className="p-4 flex items-center justify-between border-b  text-white">
          <select
            className="border rounded p-2 w-full"
            value={currentChatroom}
            onChange={(e) => setCurrentChatroom(e.target.value)}
          >
            {chatrooms.map((chatroom) => (
              <option key={chatroom.id} value={chatroom.id}>
                {chatroom.name}
              </option>
            ))}
          </select>
          <Button className="ml-2" onClick={handleAddChatroom}>
            <Plus className="mr-2 h-4 w-4" />
            Add Chatroom
          </Button>
        </div>

        {/* Messages Area */}
        <CardContent className="flex-grow p-0">
          <ScrollArea className="h-full p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start mb-4",
                  message.user === (auth.currentUser?.displayName || auth.currentUser?.email)
                    ? "justify-end"
                    : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg p-2 max-w-[70%]",
                    message.user === (auth.currentUser?.displayName || auth.currentUser?.email)
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

        {/* Input Area */}
        <CardFooter className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
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
    </div>
  );
}
