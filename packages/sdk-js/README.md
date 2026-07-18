# PromptOS TypeScript SDK

Official SDK for PromptOS.

## Installation

```bash
npm install @promptos/sdk

import {PromptOS} from "@promptos/sdk";

const client = new PromptOS({
    apiKey: process.env.PROMPTOS_API_KEY!,
});

const response = await client.promptos.enhance({
    prompt: "Explain Kubernetes"
});
```
