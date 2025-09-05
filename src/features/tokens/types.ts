export interface Token {
  coinId: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  holdings: number;
  value: number;
  sparkline: number[];
}

export interface GlobalTokensState {
  watchlist: Token[];
  lastUpdated: string;
}
