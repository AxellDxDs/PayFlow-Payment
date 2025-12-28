"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User, Loader2 } from "@/components/icons"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

const quickReplies = [
  "Cara top up saldo?",
  "Lupa PIN transaksi",
  "Cara verifikasi KYC?",
  "Promo hari ini",
  "Hubungi CS",
]

const botResponses: Record<string, string> = {
  "cara top up saldo?":
    "Untuk top up saldo, ikuti langkah berikut:\n1. Buka menu 'Top Up' di dashboard\n2. Pilih nominal yang diinginkan\n3. Pilih metode pembayaran (VA, E-wallet, dll)\n4. Ikuti instruksi pembayaran\n5. Saldo akan masuk otomatis setelah pembayaran berhasil",
  "lupa pin transaksi":
    "Jika Anda lupa PIN transaksi:\n1. Buka menu Pengaturan > Keamanan\n2. Pilih 'Lupa PIN'\n3. Verifikasi identitas via OTP\n4. Buat PIN baru\n\nAtau hubungi CS kami di 1500-XXX",
  "cara verifikasi kyc?":
    "Untuk verifikasi KYC:\n1. Buka menu Pengaturan > Profil\n2. Klik 'Verifikasi KYC'\n3. Upload foto KTP dengan jelas\n4. Ambil foto selfie dengan KTP\n5. Tunggu proses verifikasi (1x24 jam)",
  "promo hari ini":
    "Promo hari ini:\n🎉 Cashback 20% untuk top up pertama\n🍔 Diskon 30% pesan makanan\n💎 Bonus 50 diamonds beli game\n\nLihat semua promo di menu Promo!",
  "hubungi cs":
    "Anda dapat menghubungi Customer Service kami:\n📞 Call Center: 1500-XXX (24 jam)\n📧 Email: support@digibank.id\n💬 Live Chat: Tersedia 24/7\n\nKami siap membantu Anda!",
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      content: "Halo! Saya DigiBot, asisten virtual Anda. Ada yang bisa saya bantu hari ini?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const lowerText = text.toLowerCase()
    let botResponse =
      "Maaf, saya tidak mengerti pertanyaan Anda. Silakan pilih topik dari menu atau ketik 'hubungi cs' untuk berbicara dengan customer service kami."

    for (const [key, value] of Object.entries(botResponses)) {
      if (lowerText.includes(key.replace("?", ""))) {
        botResponse = value
        break
      }
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: botResponse,
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        size="icon"
        className={cn("fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50", isOpen && "hidden")}
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/bot-avatar.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">DigiBot</CardTitle>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex gap-2", message.sender === "user" && "flex-row-reverse")}>
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    {message.sender === "bot" ? (
                      <>
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <AvatarFallback className="bg-muted">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={cn(
                      "rounded-lg p-3 max-w-[80%] text-sm whitespace-pre-line",
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex gap-1">
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickReplies.map((reply) => (
                <Button
                  key={reply}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 text-xs bg-transparent"
                  onClick={() => sendMessage(reply)}
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 pt-2 border-t border-border">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(input)
              }}
            >
              <Input
                placeholder="Ketik pesan..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  )
}
