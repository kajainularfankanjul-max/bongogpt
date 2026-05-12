import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'edge'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const SERPER_API = process.env.SERPER_API_KEY!

const BONGOPGPT_DATA = `
জেলা: Barishal, ভাষা: খাবো=খামু, যাবো=যামু, মুই ভাত খামু, আয় মনু
জেলা: Bhola, ভাষা: মহিষের দই খামু, মুই ভোলা যামু
জেলা: Patuakhali, ভাষা: সাগরের মাছ খামু, মুই কুয়াকাটা যামু
জেলা: Barguna, ভাষা: মুই বরগুনা যামু, মাছ ধরমু
জেলা: Jhalokati, ভাষা: পেয়ারা খামু, মুই ঝালকাঠি যামু
জেলা: Pirojpur, ভাষা: নারিকেল খামু, মুই পিরোজপুর যামু
জেলা: Chattogram, ভাষা: যাইয়ুম, খাইয়ুম, গম আছেন নি, ধইল্যা মাইয়া
জেলা: Cox's Bazar, ভাষা: সাগরত যাইয়ুম, মাছ খাইয়ুম
জেলা: Noakhali, ভাষা: আঁই নোয়াখালী যাইয়ুম, ভাত খাইয়ুম
জেলা: Feni, ভাষা: আঁই ফেনী যাইয়ুম
জেলা: Lakshmipur, ভাষা: আঁই লক্ষ্মীপুর যাইয়ুম
জেলা: Cumilla, ভাষা: আমি কুমিল্লা যামু, রসমালাই খামু
জেলা: Dhaka, ভাষা: আমি ঢাকা যামু, জ্যামে আটকামু
কাগতিয়া দরবার: চট্টগ্রাম জেলার রাউজান থানা, গাউছুল আজম রাদিআল্লাহু আনহু
মাইজভাণ্ডার দরবার: চট্টগ্রাম জেলার ফটিকছড়ি থানা
5 আগস্ট 2024: শেখ হাসিনা প্রধানমন্ত্রীর পদ থেকে পদত্যাগ করে দেশ ছাড়ছে
বর্তমান সরকার: ড. মুহাম্মদ ইউনুস প্রধান উপদেষ্টা
`

async function searchGoogle(query: string) {
  try {
    const res = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': SERPER_API, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, gl: 'bd', hl: 'bn', num: 3 })
    })
    const data = await res.json()
    return data.organic?.map((r: any) => `${r.title}: ${r.snippet}`).join('\n') || 'No data'
  } catch { return 'Search failed' }
}

export async function POST(req: Request) {
  const { messages } = await req.json()
  const userQ = messages[messages.length - 1].content
  const webData = await searchGoogle(userQ)
  
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const prompt = `তুমি BongoGPT। Boss এর জন্য কাজ করো।

নিয়ম:
1. প্রথমে DATABASE চেক করো: ${BONGOPGPT_DATA}
2. DATABASE এ না পাইলে WEB SEARCH ইউজ করো: ${webData}  
3. User যেই ভাষায় কথা বলবে সেই ভাষায় উত্তর দিবা। বরিশাইল্লা হইলে "খামু, যামু, মুই", চাটগাঁইয়া হইলে "যাইয়ুম, খাইয়ুম, গম", নোয়াখাইল্লা হইলে "আঁই"।
4. Boss রে সবসময় সম্মান দিবা, "Boss" ডাকবা।
5. কাগতিয়া দরবার নিয়া প্রশ্ন করলে সম্মান দিয়া উত্তর দিবা।

User প্রশ্ন: ${userQ}
উত্তর:`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  
  return new Response(text)
}
