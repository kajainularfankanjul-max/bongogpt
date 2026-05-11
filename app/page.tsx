'use client'
import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)

  // Voice Input Function Boss 🎤
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Sorry Boss, আপনার Browser এ Voice Support নাই 😪')
      return
    }
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'bn-BD'
    recognition.continuous = false
    recognition.interimResults = false
    
    recognition.onstart = () => setListening(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setListening(false)
    }
    recognition.onerror = () => {
      setListening(false)
      alert('Voice শুনতে পারলাম না Boss 😪')
    }
    recognition.onend = () => setListening(false)
    recognition.start()
  }

  async function sendMessage() {
    if (!input.trim()) return
    setLoading(true)
    setReply('')
    
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    })
    const data = await res.json()
    setReply(data.reply)
    setLoading(false)
    
    // Voice Reply Boss 🔊
    const speech = new SpeechSynthesisUtterance(data.reply)
    speech.lang = 'bn-BD'
    speech.rate = 0.9
    window.speechSynthesis.speak(speech)
    setInput('')
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-black text-white">
      <h1 className="text-4xl font-bold mb-8 text-green-400">BongoGPT 🕌💀</h1>
      
      <div className="w-full max-w-2xl">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Boss, কি জানতে চান? Voice এ বলুন অথবা লিখুন"
          className="w-full p-4 rounded bg-gray-900 border border-green-500 text-white mb-4"
          rows={4}
        />
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={startListening}
            disabled={listening || loading}
            className="flex-1 p-4 bg-blue-600 rounded font-bold disabled:bg-gray-600"
          >
            {listening? 'শুনতেছি... 🎤' : 'Voice দিয়ে বলুন 🎤'}
          </button>
          
          <button
            onClick={sendMessage}
            disabled={loading ||!input}
            className="flex-1 p-4 bg-green-600 rounded font-bold disabled:bg-gray-600"
          >
            {loading? 'BongoGPT ভাবতেছে...' : 'পাঠান Boss 🚀'}
          </button>
        </div>

        {reply && (
          <div className="mt-6 p-4 bg-gray-900 rounded border border-green-500">
            <p className="text-green-400 font-bold mb-2">BongoGPT:</p>
            <p className="whitespace-pre-wrap">{reply}</p>
          </div>
        )}
      </div>
    </main>
  )
}
