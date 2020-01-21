import Twitter from 'twitter';
import fetch from 'node-fetch';
import * as functions from 'firebase-functions';
import { searchTweet } from './search-tweet';
import { admin } from './admin';
import { Status } from 'twitter-d';
import { config } from './config';

type SinceIdDoc = {
  name: 'sinceId';
  value: string;
};

export async function handler() {
  const { env } = functions.config();
  const { collectionName, docName, searchParams } = config;

  const client = new Twitter(env);

  const firestore = admin.firestore();

  const sinceId = await firestore
    .collection(collectionName)
    .doc(docName)
    .get()
    .then(doc => (doc.exists ? (doc.data()! as SinceIdDoc).value : undefined));

  const statuses = await searchParams
    .reduce(async (statusesPromise: Promise<Status[]>, searchParam): Promise<
      Status[]
    > => {
      const statuses = await statusesPromise;
      const nextStatuses = await searchTweet(client, searchParam, sinceId)
        .then(ss =>
          searchParam.excludeQuery
            ? ss.filter(
                s => !(s as any).text.includes(searchParam.excludeQuery)
              )
            : ss
        )
        .then(ss =>
          searchParam.excludeRetweet
            ? ss.filter(s => !Boolean(s.retweeted_status))
            : ss
        );
      return [...statuses, ...nextStatuses];
    }, Promise.resolve([]))
    .then(statuses =>
      statuses
        .reduce((ss: Status[], next): Status[] => {
          if (!next?.id_str) {
            return ss;
          }
          return ss.map(s => s?.id_str).includes(next.id_str)
            ? ss
            : [...ss, next];
        }, [])
        .sort((prev, next) =>
          BigInt(prev.id_str) > BigInt(next.id_str) ? 1 : -1
        )
    );

  for (const status of statuses) {
    await fetch(env.WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({
        text: `@${(status.user as any).screen_name} ${
          (status as any).text
        }\nhttps://twitter.com/${(status.user as any).screen_name}/status/${
          status.id_str
        }`
      })
    });
  }

  const nextSinceId = statuses.slice(-1)[0].id_str;
  await firestore
    .collection(collectionName)
    .doc(docName)
    .set({
      name: 'sinceId',
      value: nextSinceId
    });
}
