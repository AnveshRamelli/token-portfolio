// src/features/search/searchApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { SearchResult } from './types';
import { BASE_URL } from '../../lib/constants';


export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    // GET /search/trending
    getTrendingCoins: builder.query<SearchResult[], void>({
      query: () => '/search/trending',
      transformResponse: (response: any) => {
        return response.coins.map((c: any) => ({
          coinId: c.item.id,
          name: c.item.name,
          symbol: c.item.symbol,
          image: c.item.thumb,
        })) as SearchResult[];
      },
    }),

    // GET /search?query=bitcoin
    searchCoins: builder.query<SearchResult[], string>({
      query: (q) => `/search?query=${encodeURIComponent(q)}`,
      transformResponse: (response: any) => {
        return response.coins.map((c: any) => ({
          coinId: c.id,
          name: c.name,
          symbol: c.symbol,
          image: c.thumb,
        })) as SearchResult[];
      },
    }),
  }),
});

export const { useGetTrendingCoinsQuery, useSearchCoinsQuery } = searchApi;
