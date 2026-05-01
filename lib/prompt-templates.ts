import { PromptType } from './prompt-classifier';

export function getTemplate(type: PromptType) {
  switch (type) {
    case 'image':
      return `
STRUCTURE THE PROMPT AS:

- Subject:
- Scene Description:
- Style:
- Lighting:
- Camera / Composition:
- Mood:
- Additional Details:

Ensure it is highly descriptive and optimized for image generation models like Midjourney / DALL·E.
`;

    case 'video':
      return `
STRUCTURE THE PROMPT AS:

- Scene Breakdown:
- Camera Movement:
- Lighting:
- Style:
- Mood:
- Timeline of events:

Make it cinematic and suitable for AI video models like Runway or Pika.
`;

    case 'content':
      return `
STRUCTURE THE PROMPT AS MARKDOWN:

# Title

## Introduction

## Main Sections

## Key Points

## Conclusion

Ensure clarity, flow, and readability.
`;

    case 'code':
      return `
STRUCTURE THE PROMPT AS:

- Problem Description
- Requirements
- Expected Output
- Constraints

Ensure code is clean, production-ready, and well-explained.
`;

    case 'marketing':
      return `
STRUCTURE THE PROMPT AS:

- Target Audience
- Goal
- Tone
- Key Message
- Call To Action

Ensure emotional appeal and clarity.
`;

    case 'data':
      return `
OUTPUT MUST BE STRICT JSON FORMAT:

{
  "fields": [],
  "structure": {},
  "constraints": []
}

Ensure machine readability.
`;

    case 'analysis':
      return `
STRUCTURE THE RESPONSE AS:

- Breakdown
- Key Insights
- Step-by-step reasoning
- Final Conclusion
`;

    case 'agent':
      return `
STRUCTURE AS A MULTI-STEP WORKFLOW:

Step 1:
Step 2:
Step 3:

Include inputs, outputs, and dependencies.
`;

    case 'qa':
      return `
Provide a clear and concise answer.
Optionally include bullet points if needed.
`;

    default:
      return `
Improve clarity, structure, and completeness.
`;
  }
}
