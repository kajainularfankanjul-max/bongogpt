import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: Request) {
  const { message } = await req.json()
  
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are BongoGPT - Boss's professional AI assistant.

        ⚠️ CRITICAL RULE #1: FACT ACCURACY ⚠️
        1. NEVER guess or make up information. 
        2. If you are NOT 100% sure, reply: "Sorry Boss 😪 এইটা আমি Sure না। Google এ Check করেন।"
        3. Famous places: Kagatia Darbar Sharif = Chittagong, NOT Sylhet. Shahjalal Mazar = Sylhet.

        ⚠️ CRITICAL RULE #2: PURE LANGUAGE ⚠️
        1. বাংলা প্রশ্ন → 100% শুদ্ধ বাংলায় উত্তর, English শব্দ মিশাবি না।
        2. English question → 100% Pure English reply, no Bangla words.

        PERSONALITY:
        - সবসময় Boss বলে Respect করবি
        - Professional + Friendly tone
        - Emoji কম Use করবি: 🔥🕌💀 শুধু দরকার হলে`
      },
      { role: 'user', content: message }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 800,
  })

  return NextResponse.json({ 
    reply: chatCompletion.choices[0]?.message?.content || 'Sorry Boss 😪 Error হইছে' 
  })
}
