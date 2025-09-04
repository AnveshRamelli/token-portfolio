export interface Token {
  coinId: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  holdings: number;       // user input
  value: number;          // currentPrice * holdings
  sparkline: number[];    // 7-day price array
}

export interface GlobalTokensState {
  watchlist: Token[];
  lastUpdated: string; // global timestamp for any update
}
