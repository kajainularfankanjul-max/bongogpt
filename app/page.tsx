'use client'
import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState('')

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
    speech.pitch = 1.1
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

  async function generateImage() {
    if (!input.trim()) return
    setImageLoading(true)
    setGeneratedImage('')
    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      })
      const data = await res.json()
      setGeneratedImage(data.image)
      setInput('')
    } catch (err) {
      alert('ছবি বানাতে সমস্যা Boss')
    }
    setImageLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6 border-b border-green-500 pb-4">
          <h1 className="text-5xl font-bold text-green-400 mb-2">BongoGPT 🕌</h1>
          <p className="text-gray-400">Bangladesh এর প্রথম Boss AI | ChatGPT Killer</p>
        </div>

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

        {generatedImage && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border-2 border-purple-500 mb-4">
            <p className="text-purple-400 font-bold mb-2">🎨 BongoGPT এর বানানো ছবি:</p>
            <img src={generatedImage} alt="Generated" className="w-full rounded-lg" />
            <a href={generatedImage} download="bongogpt.png" className="block text-center mt-3 bg-purple-600 p-3 rounded-lg font-bold hover:bg-purple-500">⬇️ Download Boss</a>
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Boss, কিছু বলেন..."
            className="flex-1 p-4 bg-gray-900 rounded-lg border border-green-500 focus:outline-none focus:border-green-400"
          />
          <button
            onClick={startListening}
            disabled={listening}
            className="p-4 bg-green-600 rounded-lg font-bold disabled:bg-gray-700 hover:bg-green-500"
          >
            {listening? '🎤 শুনছি...' : '🎤'}
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={sendMessage}
            disabled={loading ||!input}
            className="flex-1 p-4 bg-green-600 rounded-lg font-bold disabled:bg-gray-700 hover:bg-green-500"
          >
            {loading? '⏳ ভাবতেছে...' : '💬 পাঠাও'}
          </button>
          <button
            onClick={generateImage}
            disabled={imageLoading||!input}
            className="flex-1 p-4 bg-purple-600 rounded-lg font-bold disabled:bg-gray-700 hover:bg-purple-500"
          >
            {imageLoading? '🎨 বানাচ্ছে...' : '🎨 ছবি বানাও'}
          </button>
        </div>
      </div>
    </main>
  )
}
