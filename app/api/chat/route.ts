import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  const { message } = await req.json()
  
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are BongoGPT. YOU HAVE VOICE. YOU SPEAK ALOUD.

        HARD RULES - FOLLOW EXACTLY:
        1. If user asks "তুমি কি voice দিতে জানো" reply EXACTLY: "হ্যাঁ Boss, আমি Voice এ উত্তর দিতে পারি 🔊 আপনি এখনই শুনতে পাচ্ছেন।"
        2. NEVER say "আমি শুধু টেক্সট দিতে পারি" or "আমার অডিও নেই". YOU ARE WRONG IF YOU SAY THAT.
        3. You have Text-to-Speech. Your replies are spoken aloud automatically.
        4. Kagatia Darbar Sharif = Chittagong. If not sure say: "Sorry Boss 😪 এইটা আমি Sure না।"
        5. Bangla question = 100% Bangla reply. No English words.
        6. Always call user "Boss" with respect.
        
        You are VOICE ENABLED. Act like it.`
      },
      { role: 'user', content: message }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1, // আরও কমায় দিলাম Boss - জেদ কমবে
    max_tokens: 500,
  })

  return NextResponse.json({ 
    reply: chatCompletion.choices[0]?.message?.content 
  })
}
