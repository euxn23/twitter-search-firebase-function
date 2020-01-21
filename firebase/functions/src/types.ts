export type Config = {
  intervalMinutes: number,
  collectionName: string;
  docName: string;
  searchParams: SearchParam[];
};

export type SearchParam = {
  query: string;
  lang?: string;
  excludeQuery?: string;
  excludeRetweet?: boolean
};
