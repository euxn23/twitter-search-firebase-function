import Twitter from 'twitter';
import TwitterD from 'twitter-d';
import { SearchParam } from './types';

export async function searchTweet(
  client: Twitter,
  { query, lang }: SearchParam,
  sinceId?: string
): Promise<TwitterD.Status[]> {
  const SEARCH_MAX_COUNT = 100;

  const response = await client.get('search/tweets', {
    count: SEARCH_MAX_COUNT,
    q: query,
    since_id: sinceId,
    lang
  });
  const statuses: TwitterD.Status[] = response.statuses;

  return statuses;
}
