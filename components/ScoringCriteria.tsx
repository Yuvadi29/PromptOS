import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AlertCircle, Check, Info } from 'lucide-react';


const crieteria = [
    {
        name: "Clarity",
        description: "How Clear and understandable is the prompt ?",
        tips: ["Use Simple, direct language", "Avoid ambiguity and vague terms", "State your request explicitly"]
    },
    {
        name: "Specificity",
        description: "How detailed and specefic is the prompt ?",
        tips: ["Include relevant details", "Specify format, length, or style", "Provide context when needed"]
    },
    {
        name: "Relevance",
        description: "Does the prompt contain relevant information?",
        tips: ["Include only necessary information", "Avoid unrelated tangents", "Focus on the core request"]
    },
    {
        name: "Structure",
        description: "Is the prompt well-organized?",
        tips: ["Use logical ordering", "Break complex requests into parts", "Use formatting for readability"],
    },
    {
        name: "Conciseness",
        description: "Is the prompt appropriately concise?",
        tips: ["Avoid unnecessary words", "Be direct but complete", "Balance brevity with clarity"],
    },
]

const ScoringCriteria = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <Info className='h-5 w-5' />
                    Scoring Criteria
                </CardTitle>
            </CardHeader>

            <CardContent className='space-y-6'>
                {crieteria?.map((crieterion) => (
                    <div key={crieterion?.name} className="space-y-2">
                        <h2 className='font-medium'>{crieterion?.name}</h2>
                        <p className="text-sm text-muted-foreground">{crieterion?.description}</p>
                        <ul className="space-y-1">
                            {crieterion?.tips?.map((tip) => (
                                <li key={tip} className="text-sm flex items-start gap-2">
                                    <Check className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="rounded-lg bg-muted p-3 text-sm">
                    <div className="flex items-start gap-2">
                        <AlertCircle className='h-4 w-4 text-amber-500 mt-0.5 shrink-0'/>
                        <p>
                            This scoring system evaluates prompts baded on the best practices for effective communication with AI systems.
                            Higher score indicates prompts that are more likely to produce desired results.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ScoringCriteria