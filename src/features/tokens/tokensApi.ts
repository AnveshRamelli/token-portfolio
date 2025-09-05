import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Token } from "./types";
import { BASE_URL } from "../../lib/constants";

// Fetch multiple coins by IDs
export const tokensApi = createApi({
  reducerPath: "tokensApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getCoinsByIds: builder.query<Token[], string[]>({
      query: (ids) =>
        `/coins/markets?vs_currency=usd&ids=${ids.join(",")}&sparkline=true`,
      transformResponse: (response: any) =>
        response.map((token: any) => ({
          coinId: token.id,
          name: token.name,
          symbol: token.symbol,
          image: token.image,
          currentPrice: token.current_price,
          priceChange24h: token.price_change_percentage_24h,
          holdings: 0,
          value: 0,
          lastUpdated: token.last_updated,
          sparkline: token.sparkline_in_7d?.price || [],
        })),
    }),
  }),
});

export const { useLazyGetCoinsByIdsQuery } = tokensApi;
