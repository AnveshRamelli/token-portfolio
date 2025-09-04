// src/features/tokens/tokensApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Token } from './types';
import { BASE_URL } from '../../lib/constants';
import type { SearchResult } from '../search/types';

export const tokensApi = createApi({
  reducerPath: 'tokensApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({


    // Fetch coin market data by IDs: returns Token[]
    getCoinsByIds: builder.query<Token[], string[]>({
      query: (ids) =>
        `/coins/markets?vs_currency=usd&ids=${ids.join(',')}&sparkline=true`,
      transformResponse: (response: any) =>
        response.map((t: any) => ({
          coinId: t.id,
          name: t.name,
          symbol: t.symbol,
          image: t.image,
          currentPrice: t.current_price,
          priceChange24h: t.price_change_percentage_24h,
          holdings: 0,
          value: 0,
          lastUpdated: t.last_updated,
          sparkline: t.sparkline_in_7d?.price || [],
        })),
    }),
  }),
});

export const {
  useLazyGetCoinsByIdsQuery,
} = tokensApi;
