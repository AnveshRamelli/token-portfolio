// src/features/portfolio/portfolioSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Token } from '../tokens/types';
import type {  ChartData } from './types';

// --- Watchlist ---
export const selectWatchlist = (state: RootState): Token[] => state.tokens.watchlist;

// --- Portfolio total ---
export const selectPortfolioTotal = createSelector(
  selectWatchlist,
  (tokens: Token[]): number => tokens.reduce((acc, token) => acc + token.value, 0)
);

// --- Random color generator ---
const randomColor = (): string =>
  '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

// --- Chart data ---
export const selectChartData = createSelector(
  [selectWatchlist, selectPortfolioTotal],
  (tokens: Token[], total: number): ChartData[] =>
    tokens.map((token) => ({
      id: token.coinId,
      name: token.name,
      symbol: token.symbol,
      percentage: total ? (token.value / total) * 100 : 0,
      color: randomColor(),
    })).filter((entry) => entry.percentage > 0)
);

// --- Last updated ---
export const selectLastUpdated = (state: RootState): string => state.tokens.lastUpdated;
