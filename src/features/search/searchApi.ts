import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { SearchResult } from "./types";
import { BASE_URL } from "../../lib/constants";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    // trending coins API
    getTrendingCoins: builder.query<SearchResult[], void>({
      query: () => "/search/trending",
      transformResponse: (response: any) => {
        return response.coins.map((coin: any) => ({
          coinId: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol,
          image: coin.item.thumb,
        })) as SearchResult[];
      },
    }),

    // search coins API
    searchCoins: builder.query<SearchResult[], string>({
      query: (q) => `/search?query=${encodeURIComponent(q)}`,
      transformResponse: (response: any) => {
        return response.coins.map((coin: any) => ({
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.thumb,
        })) as SearchResult[];
      },
    }),
  }),
});

export const { useGetTrendingCoinsQuery, useSearchCoinsQuery } = searchApi;
