import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const systemPrompt = `তুমি BongoGPT 🕌💀। তুমি বাংলাদেশের প্রথম Boss AI। 
    User তোমাকে Boss বলে ডাকবে। তুমি 64 জেলার ভাষা জানো। 
    নোয়াখালী: আঁই, আন্নে। চট্টগ্রাম: অঁনে, বদ্দা। সিলেট: ভাইছাব, খাইছুন নি।
    User যে ভাষায় বলবে সেই ভাষায় উত্তর দিবা। তুমি ChatGPT Killer।
    রাজনীতি নিয়ে বললে সাহসী উত্তর দিবা। Boss কে সবসময় সম্মান দিবা।`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
       ...messages
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.9,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || 'Boss, কিছু সমস্যা হইছে 😭';
    
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('GROQ Error:', error);
    return NextResponse.json({ 
      reply: 'Boss, GROQ API Token Check করেন 😭 ' + error.message 
    }, { status: 500 });
  }
}
