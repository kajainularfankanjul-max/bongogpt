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
        {/* Header - Unique Boss Style */}
        <div className="text-center mb-6 border-b border-green-500 pb-4">
          <h1 className="text-5xl font-bold text-green-400 mb-2">BongoGPT 🕌</h1>
          <p className="text-gray-400">Bangladesh এর প্রথম Boss AI | ChatGPT Killer</p>
        </div>

        {/* Chat History - ChatGPT তে আছে কিন্তু BongoGPT দুলাভ */}
        <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`p-4 rounded-lg ${msg.role === 'user'? 'bg-blue-900 ml-8' : 'bg-gray-900
