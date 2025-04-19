import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

export const generatePrompt = async (input:string) => {
    const model = genAI.getGenerativeModel({
        model:"gemini-2.0-flash"
    });

    const result = await model.generateContent(input);
    const response = await result.response;
    return response.text();
};