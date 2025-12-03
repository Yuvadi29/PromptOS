import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ChevronDown, Info, Sparkles } from 'lucide-react';

const criteria = [
    {
        name: "Clarity",
        icon: "💡",
        description: "Clear and understandable language",
    },
    {
        name: "Specificity",
        icon: "🎯",
        description: "Detailed and precise instructions",
    },
    {
        name: "Relevance",
        icon: "✅",
        description: "Focused on essential information",
    },
    {
        name: "Structure",
        icon: "🏗️",
        description: "Well-organized and logical",
    },
    {
        name: "Conciseness",
        icon: "⚡",
        description: "Brief yet complete",
    },
]

const ScoringCriteria = () => {
    return (
        <Card className="bg-zinc-900/30 border-zinc-800/50 shadow-xl">
            <CardHeader className="pb-4">
                <CardTitle className='flex items-center gap-3 text-zinc-200'>
                    <div className="p-1.5 rounded-lg bg-orange-500/10">
                        <Info className='h-4 w-4 text-orange-400' />
                    </div>
                    <div>
                        <div className="text-base font-semibold">Scoring Criteria</div>
                        <div className="text-xs text-zinc-500 font-normal mt-0.5">5 Key Dimensions</div>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className='p-4 space-y-2'>
                {criteria?.map((criterion, index) => (
                    <div
                        key={criterion?.name}
                        className="group relative rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-3 hover:bg-zinc-800/30 hover:border-orange-500/20 transition-all duration-200"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-base group-hover:border-orange-500/30 transition-colors">
                                {criterion.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-zinc-200 mb-0.5 group-hover:text-orange-400 transition-colors">
                                    {criterion.name}
                                </h3>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    {criterion.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="mt-6 rounded-lg bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/20 p-3">
                    <div className="flex items-start gap-2">
                        <Sparkles className='h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0' />
                        <p className="text-xs text-orange-200/70 leading-relaxed">
                            Each dimension is scored 0-10. Higher scores indicate better prompt quality.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ScoringCriteria