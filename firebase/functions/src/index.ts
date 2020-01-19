import * as functions from 'firebase-functions';
import { handler } from './handler';
import { config } from './config';

export const twitterSearch = functions
  .region('asia-northeast1')
  .pubsub.schedule(`every ${config.intervalMinutes} minutes`)
  .onRun(handler);
