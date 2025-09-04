export interface SearchResult {
  coinId: string;
  name: string;
  symbol: string;
  image: string;
}

export interface SearchCache {
  trending: SearchResult[];
  queryResults: Record<string, SearchResult[]>; // key = query string
}
