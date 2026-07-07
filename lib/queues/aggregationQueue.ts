import { Queue } from 'bullmq';
import { connection } from './redis';

export const aggregationQueue = new Queue('aggregation', {
  connection: connection as any,
});
