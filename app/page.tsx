'use client'
import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [listening, setListening] = useState(false)

  const sendMessage = async () => {
    if (!input || loading || imageLoading) return
    const userText = input
    setMessages(prev => [...prev, { role: 'boss', text: userText }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: userText }] 
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'bongo', text: data.content }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bongo', text: 'Boss, Network Error 😭' }])
    }
    setLoading(false)
  }

  const generateImage = async () => {
    if (!input || loading || imageLoading) return
    const userText = input
    setMessages(prev => [...prev, { role: 'boss', text: userText }])
    setInput('')
    setImageLoading(true)

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      })
      const data = await res.json()
      if (data.image) {
        setMessages(prev => [...prev, { role: 'bongo', image: data.image }])
      } else {
        setMessages(prev => [...prev, { role: 'bongo', text: 'Boss, ছবি বানাতে পারলাম না 😭 API Token Check করো' }])
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bongo', text: 'Boss, Server Error 😭' }])
    }
    setImageLoading(false)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Boss, আপনার Browser এ Voice কাজ করে না')
      return
    }
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'bn-BD'
    recognition.onstart = () => setListening(true)
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript)
    }
    recognition.onend = () => setListening(false)
    recognition.start()
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">BongoGPT 🥷</h1>
        <p className="text-center text-green-400 mb-6">Bangladesh এর প্রথম Boss AI | ChatGPT Killer</p>

        <div className="bg-gray-900 rounded-lg p-4 mb-4 min-h-[400px] border-green-500">
          {messages.map((msg, i) => (
            <div key={i} className="mb-4">
              {msg.role === 'boss' && (
                <div className="text-right">
                  <span className="bg-green-600 px-3 py-2 rounded-lg inline-block">
                    {msg.text}
                  </span>
                </div>
              )}
              {msg.role === 'bongo' && (
                <div className="text-left">
                  <span className="bg-gray-700 px-3 py-2 rounded-lg inline-block">
                    {msg.image? <img src={msg.image} alt="generated" className="rounded-lg max-w-xs" /> : msg.text}
                  </span>
                </div>
              )}
            </div>
          ))}
          {loading && <p className="text-gray-400">Bongo লিখছে...</p>}
          {imageLoading && <p className="text-gray-400">ছবি বানাচ্ছে...</p>}
        </div>

        <div className="flex gap-2 mb-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Boss, কিছু লিখো..."
            className="flex-1 bg-gray-800 border-green-500 rounded-lg px-4 py-2 outline-none focus:border-green-400"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={startListening} 
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            {listening? '🎙️' : '🎤'}
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={sendMessage} 
            disabled={loading || imageLoading ||!input}
            className="flex-1 p-3 bg-green-600 rounded-lg font-bold disabled:bg-gray-700 hover:bg-green-500 transition"
          >
            {loading? '⏳ চাপতেছি...' : '🚀 পাঠাও'}
          </button>
          <button 
            onClick={generateImage} 
            disabled={imageLoading || loading ||!input}
            className="flex-1 p-3 bg-purple-600 rounded-lg font-bold disabled:bg-gray-700 hover:bg-purple-500 transition"
          >
            {imageLoading? '⏳ বানাচ্ছি...' : '🎨 ছবি বানাও'}
          </button>
        </div>

      </div>
    </div>
  )
}
