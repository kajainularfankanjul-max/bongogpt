import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash" 
    });

    const lastMessage = messages[messages.length - 1].content;
    
    const result = await model.generateContent(lastMessage);
    const response = result.response.text();

    return Response.json({ 
      role: "assistant",
      content: response 
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json(
      { error: "Gemini API তে সমস্যা হইছে" },
      { status: 500 }
    );
  }
}
