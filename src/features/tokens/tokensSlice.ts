import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Token } from './types';

// --- Load initial state from localStorage ---
const savedState = localStorage.getItem('watchlist');
interface TokensState {
  watchlist: Token[];
  lastUpdated: string;
}
const initialState: TokensState = savedState
  ? JSON.parse(savedState)
  : {
      watchlist: [],
      lastUpdated: new Date().toLocaleTimeString(),
    };

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    addTokens(state, action: PayloadAction<Token[]>) {
      action.payload.forEach((t) => {
        if (!state.watchlist.find((x) => x.coinId === t.coinId)) {
          state.watchlist.push(t);
        }
      });
      state.lastUpdated = new Date().toLocaleTimeString();
      localStorage.setItem('watchlist', JSON.stringify(state)); // persist
    },

    updateHoldings(state, action: PayloadAction<{ coinId: string; holdings: number }>) {
      const idx = state.watchlist.findIndex((t) => t.coinId === action.payload.coinId);
      if (idx !== -1) {
        state.watchlist[idx].holdings = action.payload.holdings;
        state.watchlist[idx].value = state.watchlist[idx].currentPrice * action.payload.holdings;
      }
      state.lastUpdated = new Date().toLocaleTimeString();
      localStorage.setItem('watchlist', JSON.stringify(state)); // persist
    },

    deleteToken(state, action: PayloadAction<string>) {
      state.watchlist = state.watchlist.filter((t) => t.coinId !== action.payload);
      state.lastUpdated = new Date().toLocaleTimeString();
      localStorage.setItem('watchlist', JSON.stringify(state)); // persist
    },
  },
});

export const { addTokens, updateHoldings, deleteToken } = tokensSlice.actions;
export default tokensSlice.reducer;
