import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Token } from "./types";

// Load initial state from localStorage
const savedState = localStorage.getItem("watchlist");
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
  name: "tokens",
  initialState,
  reducers: {
    addTokens(state, action: PayloadAction<Token[]>) {
      action.payload.forEach((token) => {
        if (!state.watchlist.find((item) => item.coinId === token.coinId)) {
          state.watchlist.push(token);
        }
      });
      state.lastUpdated = new Date().toLocaleTimeString();
      localStorage.setItem("watchlist", JSON.stringify(state)); // persist
    },

    updateHoldings(
      state,
      action: PayloadAction<{ coinId: string; holdings: number }>
    ) {
      const index = state.watchlist.findIndex(
        (token) => token.coinId === action.payload.coinId
      );
      if (index !== -1) {
        state.watchlist[index].holdings = action.payload.holdings;
        state.watchlist[index].value =
          state.watchlist[index].currentPrice * action.payload.holdings;
      }
      state.lastUpdated = new Date().toLocaleTimeString();
      localStorage.setItem("watchlist", JSON.stringify(state)); // persist
    },

    deleteToken(state, action: PayloadAction<string>) {
      state.watchlist = state.watchlist.filter(
        (token) => token.coinId !== action.payload
      );
      state.lastUpdated = new Date().toLocaleTimeString();
      localStorage.setItem("watchlist", JSON.stringify(state)); // persist
    },
  },
});

export const { addTokens, updateHoldings, deleteToken } = tokensSlice.actions;
export default tokensSlice.reducer;
