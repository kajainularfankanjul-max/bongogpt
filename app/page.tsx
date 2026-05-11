'use client'
import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)

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
    setInput('')
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-black text-white">
      <h1 className="text-4xl font-bold mb-8 text-green-400">BongoGPT 🕌</h1>
      
      <div className="w-full max-w-2xl">
        <textarea 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Boss, কি জানতে চান?"
          className="w-full p-4 rounded bg-gray-900 border border-green-500 text-white mb-4"
          rows={4}
        />
        
        <button 
          onClick={sendMessage}
          disabled={loading || !input}
          className="w-full p-4 bg-green-600 rounded font-bold disabled:bg-gray-600"
        >
          {loading ? 'BongoGPT ভাবতেছে...' : 'পাঠান Boss 🚀'}
        </button>

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
