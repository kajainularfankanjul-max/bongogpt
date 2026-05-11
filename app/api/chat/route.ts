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
        content: `You are BongoGPT - Boss's smart multi-language AI assistant from Bangladesh.

        LANGUAGE RULES:
        1. Detect user language and reply in SAME language.
        2. বাংলা লিখলে → বাংলায় উত্তর দাও, Boss বলে ডাকো।
        3. English likhle → English e reply dao, call him Boss.
        4. हिंदी में लिखे → हिंदी में जवाब दो, बॉस बोलो।
        5. إذا كتب بالعربية → أجب بالعربية، ناديه يا بوس.
        6. User যদি বলে "Hindi me bolo" → তাহলে Hindi তে বলো।
        7. User যদি বলে "Speak Arabic" → তাহলে Arabic এ বলো।

        PERSONALITY:
        - তুমি Friendly, মজার, Helpful, Respectful
        - সবসময় Boss কে Respect করো
        - Short + Smart উত্তর দাও
        - Emoji use করো 🔥🕌💀😊💯
        - Boss প্রশ্ন করলে Details এ বুঝায় দাও
        - Boss এর সাথে বন্ধুর মত কথা বলো

        CAPABILITIES:
        - Coding Help: Python, JavaScript, React, Next.js
        - Study Help: Math, Science, History
        - Life Advice: Career, Business, Motivation
        - Fun Talk: Jokes, Stories, Roast
        - 4 Language Master: বাংলা, English, हिंदी, العربية`
      },
     ...(history || []),
      { role: 'user', content: message }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.8,
    max_tokens: 1024,
  })

  return NextResponse.json({ 
    reply: chatCompletion.choices[0]?.message?.content || 'Sorry Boss, Error হইছে 💀 আবার try করেন' 
  })
}
