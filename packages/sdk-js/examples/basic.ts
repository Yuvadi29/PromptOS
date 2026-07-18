// import { PromptOS } from "../src";

// // Example 1: Localhost Development
// // const localClient = new PromptOS({
// //   apiKey: process.env.PROMPTOS_TESTING_KEY || "",
// //   baseUrl: "http://localhost:3001/api/v1",
// //   timeout: 10000,
// //   retries: 3,
// //   retryDelay: 500,
// // });

// async function main() {
//   try {
//     // Choose which client to use for testing
//     // const client = localClient;

//     // console.log("Enhancing prompt...");
//     // const enhanceResult = await client.prompts.enhance.create({
//     //   prompt: "Explain Kubernetes like I'm five.",
//     //   answers: [
//     //     { question: "Target audience", answer: "A five year old" }
//     //   ]
//     // });
//     // console.log("Enhance Result:", JSON.stringify(enhanceResult, null, 2));

//     // console.log("\nClassifying prompt...");
//     // const classifyResult = await client.prompts.classify.create({
//     //   prompt: "Explain Kubernetes like I'm five."
//     // });
//     // console.log("Classify Result:", JSON.stringify(classifyResult, null, 2));

//   } catch (error) {
//     // console.error("SDK Error:", error);
//   }
// }

// main();
