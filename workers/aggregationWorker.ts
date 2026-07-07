// import { Worker } from "bullmq";
// import { connection } from "../lib/queues/redis";
// import { buildPromptIntelligence } from "@/lib/intelligence/buildPromptIntelligence";

// // console.log("🚀 Aggregation Worker Started...");

// const worker = new Worker(
//   "aggregation",
//   async (job) => {
//     // console.log("================================");
//     // console.log(`Processing Job: ${job.name}`);
//     switch (job.name) {
//       case "aggregate-prompt":
//         await buildPromptIntelligence(job.data.promptId);
//         break;
//     }
//     // console.log("================================");
//   },
//   {
//     connection: connection as any,
//   }
// );

// // worker.on("ready", () => {
// //   // console.log("✅ Worker Ready");
// // });

// // worker.on("completed", (job) => {
// //   // console.log(`✅ Job ${job.id} completed`);
// // });

// // worker.on("failed", (job, err) => {
// //   // console.error(`❌ Job ${job?.id} failed`, err);
// // });

// // worker.on("error", (err) => {
// //   // console.error("Worker Error", err);
// // });
