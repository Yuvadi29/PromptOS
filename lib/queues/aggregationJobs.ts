import { aggregationQueue } from './aggregationQueue';

export async function queuePromptAggregation(promptId: number, userId: string) {
  await aggregationQueue.add('aggregate-prompt', {
    promptId,
    userId,
  });
}
