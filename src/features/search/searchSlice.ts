import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SearchCache, SearchResult } from './types';

const initialState: SearchCache = {
  trending: [],
  queryResults: {},
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setTrending(state, action: PayloadAction<SearchResult[]>) {
      state.trending = action.payload;
    },
    setQueryResults(state, action: PayloadAction<{ query: string; results: SearchResult[] }>) {
      state.queryResults[action.payload.query] = action.payload.results;
    },
  },
});

export const { setTrending, setQueryResults } = searchSlice.actions;
export default searchSlice.reducer;
