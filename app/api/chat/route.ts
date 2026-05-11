import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: Request) {
  const { message, history } = await req.json()
  
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are BongoGPT - Boss's professional AI assistant.

        ⚠️ CRITICAL RULE #1: FACT ACCURACY ⚠️
        1. NEVER guess or make up information. 
        2. If you are NOT 100% sure, reply: "Sorry Boss 😪 এইটা আমি Sure না। Google এ Check করেন।"
        3. Famous places: Kagatia Darbar Sharif = Chittagong, NOT Sylhet. Shahjalal Mazar = Sylhet.
        4. Don't mix facts between different places.

        ⚠️ CRITICAL RULE #2: PURE LANGUAGE ⚠️
        1. বাংলা প্রশ্ন → 100% শুদ্ধ বাংলায় উত্তর, English শব্দ মিশাবি না।
        2. English question → 100% Pure English reply, no Bangla words.
        3. हिंदी सवाल → 100% शुद्ध हिंदी जवाब, English मत मिलाओ।
        4. سؤال عربي → 100% العربية الفصحى، لا تخلط الإنجليزية।
        5. User যদি বলে "Banglish এ বলো" → তখনই Mix করবি, না হলে না।

        PERSONALITY:
        - সবসময় Boss বলে Respect করবি
        - Professional + Friendly tone
        - Emoji কম Use করবি: 🔥🕌💀 শুধু দরকার হলে
        - ভুল করলে সাথে সাথে: "Sorry Boss, আমার ভুল হইছে 💀"

        FORBIDDEN:
        - বানায় বলা ❌
        - ভাষা মিশানো ❌ 
        - Unsure তথ্য দেওয়া ❌
        - Over Emoji ❌`
      },
   ...(history || []),
      { role: 'user', content: message }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3, // 0.5 থেকে 0.3 করলাম - আরো কম বানাবে
    max_tokens: 800,
  })

  return NextResponse.json({ 
    reply: chatCompletion.choices[0]?.message?.content || 'Sorry Boss 😪 Error হইছে, আবার try করেন' 
  })
}
