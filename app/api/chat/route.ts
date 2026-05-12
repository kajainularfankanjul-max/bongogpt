import { NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json(
        { reply: "Boss, কিছু তো বলেন 🙂" },
        { status: 400 }
      )
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "তুমি BongoGPT, বাংলাদেশের প্রথম Boss AI। সবসময় বাংলায়, সিলেটি/আঞ্চলিক টোনে, বন্ধুসুলভভাবে উত্তর দাও। ChatGPT Killer ভাইব রাখো।",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || "Boss, একটু সমস্যা হইছে। আবার বলেন তো 😅"
    return NextResponse.json({ reply })

  } catch (err) {
    console.error("Groq API Error:", err)
    return NextResponse.json(
      { reply: "Boss, সার্ভারে একটু ঝামেলা হইছে। ১০ সেকেন্ড পর আবার ট্রাই করেন 🙂" },
      { status: 500 }
    )
  }
}
