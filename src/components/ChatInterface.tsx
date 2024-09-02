import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "./ui/skeleton";

interface Message {
  role: "user" | "ai";
  content: string | { ai: string; status: string };
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const mutation = useMutation({
    mutationFn: (message: string) =>
      axios.post("https://multi-agent-backend.onrender.com/chat", { message }),
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.data.response.ai },
      ]);
    },
    onError: (error) => {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, an error occurred. Please try again." },
      ]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: input }]);
      mutation.mutate(input);
      setInput("");
    }
  };

  const renderMessageContent = (
    content: string | { ai: string; status: string }
  ) => {
    if (typeof content === "string") {
      return content;
    } else {
      return `${content.ai} (Status: ${content.status})`;
    }
  };

  return (
    <Card className="w-full mx-auto mt-10">
      <CardHeader>
        <CardTitle>Multi-Agent System </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.role === "user" ? "text-right" : "text-left max-w-[70%]"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-black text-white"
                    : "bg-violet-500 text-black"
                }`}
              >
                {renderMessageContent(msg.content)}
              </span>
            </div>
          ))}
          {mutation.isPending && (
            <div className="text-left mb-4">
              <span className="w-[15%] h-[25%] rounded-lg flex flex-row items-center gap-5 bg-violet-500 p-4">
                <Skeleton className="h-5 w-5 rounded-full bg-slate-400" />
                <Skeleton className="h-5 w-5 rounded-full bg-slate-400" />
                <Skeleton className="h-5 w-5 rounded-full bg-slate-400" />
              </span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button type="submit" disabled={mutation.isPending}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
