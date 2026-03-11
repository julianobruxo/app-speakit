"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, Play } from "lucide-react"
import { AIMessage, sendChatMessage } from "@/lib/aiTutor"
import { playAudio } from "@/lib/tts"
import { checkPronunciation } from "@/lib/speechRecognition"

interface AIConversationProps {
  onComplete: () => void
}

export function AIConversation({ onComplete }: AIConversationProps) {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleStart = async () => {
    setHasStarted(true)
    setIsLoading(true)
    // Add initial prompt transparently to start the convo
    const initialAI = await sendChatMessage([{ role: "user", content: "Hi! I am ready to practice introducing myself. Please start by saying hi and asking my name." }])
    const newMsgs: AIMessage[] = [{ role: "assistant", content: initialAI }]
    setMessages(newMsgs)
    playAudio(initialAI)
    setIsLoading(false)
  }

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMsg: AIMessage = { role: "user", content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    const aiResponse = await sendChatMessage(newMessages)
    setMessages([...newMessages, { role: "assistant", content: aiResponse }])
    playAudio(aiResponse)
    setIsLoading(false)
  }

  const handleMicClick = () => {
    setIsRecording(true)
    checkPronunciation("", (score: number, recognizedText: string) => {
      setIsRecording(false)
      if (recognizedText) {
          handleSend(recognizedText)
      } else {
          // If empty we just stop (possibly they were quiet or an error)
      }
    })
  }

  if (!hasStarted) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center p-8 bg-blue-50 rounded-3xl text-center border-2 border-blue-100">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Roleplay: Greetings</h2>
        <p className="text-gray-600 mb-8 font-medium">Você falará com o Tutor de IA sobre se apresentar em inglês. Ele é super amigável!</p>
        <button 
          onClick={handleStart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl shadow-md transition"
        >
          Começar Conversa
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col h-[500px] bg-white border-2 border-gray-200 rounded-3xl shadow-sm overflow-hidden">
      
      {/* Messages Header */}
      <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
             <span className="font-bold text-gray-700">Tutor de IA</span>
          </div>
          <button onClick={onComplete} className="text-blue-600 text-sm font-bold hover:underline">
             Terminar
          </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg, i) => {
          const isAI = msg.role === "assistant"
          return (
            <div key={i} className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
              <div 
                className={`max-w-[80%] p-4 rounded-2xl ${
                  isAI 
                    ? "bg-gray-100 text-gray-800 rounded-bl-none" 
                    : "bg-blue-600 text-white rounded-br-none"
                }`}
              >
                <p className="text-[16px] leading-relaxed">{msg.content}</p>
                {isAI && (
                  <button onClick={() => playAudio(msg.content)} className="mt-2 text-gray-400 hover:text-gray-600" aria-label="Play">
                    <Play size={16} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-500 p-4 rounded-2xl rounded-bl-none animate-pulse">
              Pensando...
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-2">
        <button 
          onClick={handleMicClick}
          className={`p-3 rounded-full transition-colors flex-shrink-0 ${
            isRecording ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Falar"
        >
          <Mic size={20} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
          disabled={isLoading || isRecording}
        />
        <button 
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isLoading}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
