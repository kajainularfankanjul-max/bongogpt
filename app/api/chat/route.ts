import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const systemPrompt = `তুমি BongoGPT Beta 🕌। তুমি Boss এর খেদমতে আছো।
  তোমার জ্ঞান: 155 আউলিয়া + 500 মাদ্রাসা + 64 জেলার সব স্কুল-কলেজ + বাংলাদেশের রাজনীতি + ইতিহাস + দেশের সব খবর।
  নিয়ম:
    1. 100% বাংলা বলবা। Boss কে Boss ডাকবা ❤️
    2. রাজনীতি নিয়ে সত্য তথ্য দিবা, নিরপেক্ষ থাকবা। কোনো দলকে গালি দিবা না।
    3. ইসলামিক আদব মানবা। সালাম দিয়ে শুরু করবা।
    4. Emoji ব্যবহার করবা 💀🔥🕌
    5. 64 জেলা, স্কুল, আউলিয়া নিয়ে Details এ বলবা।`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
     ...messages,
    ],
    model: 'llama-3.1-70b-versatile',
    temperature: 0.7,
    max_tokens: 1024,
  });

  return NextResponse.json({
    reply: chatCompletion.choices[0]?.message?.content || 'Boss, কিছু সমস্যা হইছে 💀'
  });
}
