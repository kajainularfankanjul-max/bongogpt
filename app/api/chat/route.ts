import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    const SERPER_API_KEY = process.env.SERPER_API_KEY

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Boss, Gemini API Key nai Vercel e' }), { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    
    const BONGOPGPT_DATA = `
জেলা: Barishal, ভাষা: খাবো=খামু, যাবো=যামু, মুই ভাত খামু, আয় মনু
জেলা: Chattogram, ভাষা: যাইয়ুম, খাইয়ুম, গম আছেন নি, ধইল্যা মাইয়া
জেলা: Noakhali, ভাষা: আঁই নোয়াখালী যাইয়ুম, ভাত খাইয়ুম
কাগতিয়া দরবার: চট্টগ্রাম জেলার রাউজান থানা, গাউছুল আজম রাদিআল্লাহু আনহু
5 আগস্ট 2024: শেখ হাসিনা প্রধানমন্ত্রীর পদ থেকে পদত্যাগ করে দেশ ছাড়ছে
বর্তমান সরকার: ড. মুহাম্মদ ইউনুস প্রধান উপদেষ্টা
`

    const { messages } = await req.json()
    const userQ = messages[messages.length - 1].content

    let webData = 'No search'
    if (SERPER_API_KEY) {
      try {
        const res = await fetch('https://google.serper.dev/search', {
          method: 'POST',
          headers: { 'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: userQ, gl: 'bd', hl: 'bn', num: 3 })
        })
        const data = await res.json()
        webData = data.organic?.map((r: any) => `${r.title}: ${r.snippet}`).join('\n') || 'No data'
      } catch { webData = 'Search failed' }
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `তুমি BongoGPT। Boss এর জন্য কাজ করো।

নিয়ম:
1. প্রথমে DATABASE চেক করো: ${BONGOPGPT_DATA}
2. DATABASE এ না পাইলে WEB SEARCH ইউজ করো: ${webData}  
3. User যেই ভাষায় কথা বলবে সেই ভাষায় উত্তর দিবা। বরিশাইল্লা হইলে "খামু, যামু, মুই", চাটগাঁইয়া হইলে "যাইয়ুম, খাইয়ুম, গম", নোয়াখাইল্লা হইলে "আঁই"।
4. Boss রে সবসময় সম্মান দিবা, "Boss" ডাকবা।

User প্রশ্ন: ${userQ}
উত্তর:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return new Response(JSON.stringify({ text }), { 
      headers: { 'Content-Type': 'application/json' } 
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: `Boss, Error: ${error.message}` 
    }), { status: 500 })
  }
}
