'use client'
import { useState } from 'react'

export default function BongoGPT() {
  const [msg, setMsg] = useState('')
  const [chat, setChat] = useState<{role: string, text: string}[]>([
    {role: 'bongo', text: 'আসসালামু আলাইকুম Boss ❤️ আমি BongoGPT Beta 🕌 155 আউলিয়া + 500 মাদ্রাসা আপনার খেদমতে Free। কি জানতে চান?'}
  ])

  const sendMsg = () => {
    if (!msg.trim()) return
    setChat([...chat, {role: 'user', text: msg}, {role: 'bongo', text: 'সুবহানাল্লাহ Boss 💀 এই Feature টা Beta তে Coming Soon। এখন আমরা Next.js Deploy Test করতেছি ✅ ইনশাআল্লাহ Full AI আসবে 48 ঘন্টায় 🚀'}])
    setMsg('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-green-600 text-white p-4 text-center font-bold text-xl">
          BongoGPT Beta 🕌 | 155 আউলিয়া Free AI
        </div>
        
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {chat.map((c, i) => (
            <div key={i} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-2xl ${c.role === 'user' 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-green-100 text-gray-800 rounded-bl-none border border-green-200'}`}>
                {c.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
            placeholder="Boss, কিছু জিজ্ঞাসা করেন..."
            className="flex-1 border border-green-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            onClick={sendMsg}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold"
          >
            Send 💀
          </button>
        </div>
        
        <div className="bg-gray-50 p-2 text-center text-xs text-gray-500">
          Beta Version 1.0 | Battery 62% | 11:38 AM | Nizwá, Oman
        </div>
      </div>
    </div>
  )
}
