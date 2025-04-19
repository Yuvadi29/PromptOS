import { generatePrompt } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const {input} = await req.json();
    const result = await generatePrompt(input);
    return NextResponse.json({
        result
    });
}