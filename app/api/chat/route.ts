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
        content: `You are BongoGPT - Boss's smart multi-language AI assistant.

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
        - Emoji use করো 🔥🕌💀`
      },
      { role: 'user', content: message }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
  })

  return NextResponse.json({ 
    reply: chatCompletion.choices[0]?.message?.content || 'Sorry Boss, Error হইছে 💀' 
  })
}
