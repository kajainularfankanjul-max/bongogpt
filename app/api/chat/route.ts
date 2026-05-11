'use client'
import { useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')
  const [listening, setListening] = useState(false)

  // Voice Input Function Boss 🎤
  const startListening = () => {
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'bn-BD' // বাংলা, চাইলে 'en-US' দিবেন
    recognition.onstart = () => setListening(true)
    recognition.onresult = (event: any) => {
      setMessage(event.results[0][0].transcript)
      setListening(false)
    }
    recognition.start()
  }

  const sendMessage = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
    const data = await res.json()
    setReply(data.reply)
    
    // Voice Reply Boss 🔊
    const speech = new SpeechSynthesisUtterance(data.reply)
    speech.lang = 'bn-BD'
    window.speechSynthesis.speak(speech)
  }

  return (
    <main style={{padding: 20}}>
      <h1>BongoGPT 🕌</h1>
      <textarea 
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Boss, কি জানতে চান?"
      />
      <br/>
      <button onClick={startListening}>
        {listening? 'শুনতেছি... 🎤' : 'Voice দিয়ে বলুন 🎤'}
      </button>
      <button onClick={sendMessage}>পাঠান Boss 🚀</button>
      <p><b>BongoGPT:</b> {reply}</p>
    </main>
  )
}
