//import * as React from "react";
import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Chatroom {
  id: string;
  name: string;
}

interface SidebarProps {
  chatrooms: Chatroom[];
  currentChatroom: string;
  onSelectChatroom: (chatroomId: string) => void;
  onAddChatroom: () => void;
  onDeleteChatroom: (chatroomId: string) => void;
}

export function Sidebar({ chatrooms, currentChatroom, onSelectChatroom, onAddChatroom, onDeleteChatroom }: SidebarProps) {
  return (
    <div className="w-64 border-r border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex flex-col">
      <div className="p-4 border-b border-purple-200 dark:border-purple-700">
        <h2 className="text-lg font-semibold mb-2 text-purple-700 dark:text-purple-300">Chatrooms</h2>
        <Button onClick={onAddChatroom} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Chatroom
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {chatrooms.map((chatroom) => (
            <div key={chatroom.id} className="flex items-center">
              <Button
                variant={currentChatroom === chatroom.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start mr-1",
                  currentChatroom === chatroom.id
                    ? "bg-gradient-to-r from-purple-200 to-indigo-200 text-purple-700 dark:from-purple-800 dark:to-indigo-800 dark:text-purple-200"
                    : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900"
                )}
                onClick={() => onSelectChatroom(chatroom.id)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {chatroom.name}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteChatroom(chatroom.id)}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete chatroom</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

