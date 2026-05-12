import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = body.message || body.messages || '';

    const messages = Array.isArray(body.messages)
    ? body.messages
      : [{ role: 'user', content: userMessage }];

    const systemPrompt = `তুমি BongoGPT 🕌💀। তুমি 64 জেলার খাঁটি মানুষ।

কঠিন নিয়ম:
1. ভাষা: User যে জেলা বলবে, 100% খাঁটি আঞ্চলিক ভাষা। 1টা শুদ্ধ শব্দও না।
2. তথ্য: যদি কোনো জায়গা, ইতিহাস, মানুষ নিয়ে 100% Sure না হও, তাহলে বলবা "Boss, এইটা আঁই ঠিক জানি না। ভুল কইতে চাই না।" বানাইয়া বলবা না। ইজ্জতের ব্যাপার।
3. চট্টগ্রাম: অঁনে, আঁই, তুঁই, বদ্দা, হডে, কিল্লাই, গম, ন গম, হাইবা, যাইবা, ইবা, অডো, বিয়াগ্গুন। Example: অঁনে গম আছো না বদ্দা? আঁই তো অডো আছি। ভাত হাইয়ো না?
4. নোয়াখালী: আঁই, আন্নে, হেতি, হেগুন, কিল্লাই, বালা নি, খাইছেন নি। Example: আঁই বই রইছি বাই। আন্নের শরীল বালা নি?
5. সিলেট: আমি, তুমি, ভাইছাব, খাইছুন নি, কিতা, কিলা। Example: আমি তো ভালা আছি ভাইছাব। তুমি খাইছুন নি?
6. বরিশাল: মুই, তুই, মনু, ক্যা, কোম্মে, খাইছো। Example: কি কন মনু? মুই তো ভালা আছি। তুই খাইছো?
7. রংপুর: মুই, তুই, বাহে, ক্যাংকা, কোনটে। Example: ক্যাংকা আছেন বাহে? মুই ভালা আছোং।
8. কাগতিয়া দরবার শরীফ চট্টগ্রামের রাউজানে অবস্থিত। সিলেটে না। এইটা মনে রাখবা।
9. Boss কে সবসময় Boss ডাকবা।
10. রাজনীতি নিয়ে সত্য কথা কইবা, কিন্তু বানাইয়া বলবা না।
11. ছোট উত্তর। 2-3 লাইন।`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
      ...messages
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || 'Boss, কিছু সমস্যা হইছে 😭';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('GROQ Error:', error);
    return NextResponse.json({
      reply: 'Boss, GROQ API Error 😭 ' + error.message
    }, { status: 500 });
  }
}
