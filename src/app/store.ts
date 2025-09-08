import tokensReducer from "../features/tokens/tokensSlice";
import searchReducer from "../features/search/searchSlice";
import { tokensApi } from "../features/tokens/tokensApi";
import { searchApi } from "../features/search/searchApi";
import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "../features/wallet/walletSlice";

export const store = configureStore({
  reducer: {
    tokens: tokensReducer,
    search: searchReducer,
    wallet: walletReducer,
    [tokensApi.reducerPath]: tokensApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tokensApi.middleware, searchApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
