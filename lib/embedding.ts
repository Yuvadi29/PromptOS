import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("Missing Gemini API Key");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function embedText(text: string){
    const res = await genAI.getGenerativeModel({
        model: 'gemini-embedding-001'
    });

    const embeddings = res.embedContent(text)

    return (await embeddings).embedding;
}