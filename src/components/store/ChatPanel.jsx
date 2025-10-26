"use client";

import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Paperclip, Smile, Send, Clock, Circle } from "lucide-react";

export default function ChatPanel({ open, onOpenChange, seller, product, sellerOnline = true }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      id: "m1",
      sender: "seller",
      text: `Hi! This is ${seller?.name || "Seller"}. How can I help you with ${product?.name || "the product"}?`,
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      id: "m2",
      sender: "you",
      text: "Hello! Is this available for bulk (100+ pieces)?",
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [attachments, setAttachments] = useState([]);
  const [sellerTyping, setSellerTyping] = useState(false);

  const scrollRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, sellerTyping]);

  function handlePickFiles() {
    fileRef.current?.click();
  }

  function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setAttachments((prev) => [...prev, ...files.map((f) => ({ id: `${f.name}-${Date.now()}`, file: f }))]);
    }
  }

  function removeAttachment(id) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  function sendMessage() {
    const text = message.trim();
    if (!text && attachments.length === 0) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const sentAttachments = attachments.map((a) => ({ name: a.file.name, size: a.file.size }));

    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, sender: "you", text, at: now, attachments: sentAttachments },
    ]);
    setMessage("");
    setAttachments([]);

    // Simulate seller typing then reply
    setSellerTyping(true);
    setTimeout(() => {
      setSellerTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `r-${Date.now()}`,
          sender: "seller",
          text:
            "Yes, it is available. Could you share your target price and shipping destination?",
          at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  }

  const quickTemplates = [
    "Is this available?",
    "What is your best price for 100+?",
    "Do you offer OEM/branding?",
    "Lead time and shipping options?",
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              {seller?.logo ? (
                <AvatarImage src={seller.logo} alt={seller?.name || "Seller"} />
              ) : (
                <AvatarFallback>{(seller?.name || seller?.slug || "S").charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className="truncate flex items-center gap-2">
                {seller?.name || "Seller"}
                <span className="flex items-center gap-1 text-xs font-normal">
                  <Circle className={`w-2 h-2 ${sellerOnline ? "text-green-500" : "text-gray-400"}`} fill="currentColor" />
                  <span className={sellerOnline ? "text-green-600" : "text-gray-500"}>
                    {sellerOnline ? "Online" : "Offline"}
                  </span>
                </span>
              </SheetTitle>
              <SheetDescription className="truncate">
                {product?.name || "Product"}
              </SheetDescription>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Typically replies within 2 hours</span>
            </div>
          </div>
        </SheetHeader>

        {/* Conversation */}
        <div ref={scrollRef} className="h-[calc(100vh-15rem)] overflow-y-auto p-4 space-y-3 bg-muted/20">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "you" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2 text-sm shadow-sm ${
                  m.sender === "you" ? "bg-blue-600 text-white" : "bg-white border"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{m.text}</div>
                {m.attachments?.length ? (
                  <div className={`mt-2 space-y-1 ${m.sender === "you" ? "text-blue-100" : "text-gray-600"}`}>
                    {m.attachments.map((a, i) => (
                      <div key={i} className="text-[11px]">📎 {a.name} ({Math.round(a.size / 1024)} KB)</div>
                    ))}
                  </div>
                ) : null}
                <div className={`mt-1 text-[11px] ${m.sender === "you" ? "text-blue-100" : "text-gray-500"}`}>{m.at}</div>
              </div>
            </div>
          ))}

          {sellerTyping && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-xl px-4 py-2 text-sm shadow-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <span className="relative inline-flex w-5 h-2">
                    <span className="absolute left-0 w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="absolute left-2 w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="absolute left-4 w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  Seller is typing...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick templates */}
        <div className="p-3 border-t bg-white">
          <div className="flex flex-wrap gap-2">
            {quickTemplates.map((qt) => (
              <button
                key={qt}
                onClick={() => setMessage(qt)}
                className="text-xs px-3 py-1 rounded-full border hover:bg-gray-50"
              >
                {qt}
              </button>
            ))}
          </div>

          {attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {attachments.map((a) => (
                <div key={a.id} className="flex items-center gap-2 text-xs px-2 py-1 rounded border bg-gray-50">
                  <span>📎 {a.file.name}</span>
                  <button onClick={() => removeAttachment(a.id)} className="text-gray-500 hover:text-gray-700">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Composer */}
        <div className="p-3 bg-white">
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFilesSelected} />
            <Button variant="ghost" className="h-9 w-9" title="Attach" onClick={handlePickFiles}>
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="h-9 w-9" title="Emoji">
              <Smile className="w-4 h-4" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message to the seller..."
              className="flex-1 h-10"
            />
            <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4">
              <Send className="w-4 h-4" />
              <span className="ml-2">Send</span>
            </Button>
          </div>
          <div className="mt-2 text-[11px] text-gray-500">
            By contacting, you agree to share your inquiry with {seller?.name || "seller"}. Please avoid sharing sensitive information.
          </div>
        </div>

        <SheetFooter className="border-t p-3">
          <div className="text-xs text-gray-500">Secure messaging powered by our platform</div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}