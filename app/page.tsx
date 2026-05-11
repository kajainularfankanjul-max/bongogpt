'use client'
import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)

  const startListening = () => {
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'bn-BD'
    recognition.onstart = () => setListening(true)
    recognition.onresult = (e: any) => {
      setInput(e.results[0][0].transcript)
      setListening(false)
    }
    recognition.start()
  }

  const speakReply = (text: string) => {
    window.speechSynthesis.cancel()
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = 'bn-BD'
    speech.rate = 0.85
    speech.pitch = 1.1 // Boss এর Voice একটু Heavy
    window.speechSynthesis.speak(speech)
  }

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = input
    setMessages(prev => [...prev, {role: 'user', content: userMsg}])
    setInput('')
    setLoading(true)
    
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMsg })
    })
    const data = await res.json()
    setMessages(prev => [...prev, {role: 'bongo', content: data.reply}])
    setLoading(false)
    speakReply(data.reply)
  }

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header - Unique Boss Style */}
        <div className="text-center mb-6 border-b border-green-500 pb-4">
          <h1 className="text-5xl font-bold text-green-400 mb-2">BongoGPT 🕌💀</h1>
          <p className="text-gray-400">Bangladesh এর প্রথম Boss AI | ChatGPT Killer</p>
        </div>

        {/* Chat History - ChatGPT তে আছে কিন্তু BongoGPT সুন্দর */}
        <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`p-4 rounded-lg ${msg.role === 'user'? 'bg-blue-900 ml-8' : 'bg-gray-900 border border-green-500 mr-8'}`}>
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-green-400">
                  {msg.role === 'user'? '👑 Boss:' : '🕌 BongoGPT:'}
                </p>
                {msg.role === 'bongo' && (
                  <button onClick={() => speakReply(msg.content)} className="text-xs bg-green-600 px-2 py-1 rounded">
                    🔊 শুনুন
                  </button>
                )}
              </div>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
          {loading && <div className="text-green-400 animate-pulse">BongoGPT ভাবতেছে... 🧠</div>}
        </div>

        {/* Input Area - Unique Style */}
        <div className="sticky bottom-0 bg-black pt-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' &&!e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Boss, কি জানতে চান? Enter = Send"
            className="w-full p-4 rounded-lg bg-gray-900 border-2 border-green-500 text-white mb-3"
            rows={3}
          />
          
          <div className="flex gap-2">
            <button
              onClick={startListening}
              disabled={listening}
              className="flex-1 p-4 bg-blue-600 rounded-lg font-bold disabled:bg-gray-700 hover:bg-blue-500"
            >
              {listening? '🎤 শুনতেছি...' : '🎤 Voice'}
            </button>
            
            <button
              onClick={sendMessage}
              disabled={loading ||!input}
              className="flex-1 p-4 bg-green-600 rounded-lg font-bold disabled:bg-gray-700 hover:bg-green-500"
            >
              {loading? '⏳' : '🚀 পাঠান Boss'}
            </button>
          </div>
          
          <p className="text-xs text-center text-gray-600 mt-3">
            BongoGPT v5.0 | Made for Boss 🕌💀 | Chrome এ Voice Best
          </p>
        </div>
      </div>
    </main>
  )
}
