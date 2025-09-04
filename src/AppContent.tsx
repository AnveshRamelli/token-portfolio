// src/AppContent.tsx
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  addTokens,
  updateHoldings,
  deleteToken,
} from "./features/tokens/tokensSlice";
import {
  selectWatchlist,
  selectPortfolioTotal,
  selectChartData,
  selectLastUpdated,
} from "./features/portfolio/portfolioSelectors";
import { PieChart, Pie, Cell } from "recharts";
import {
  useGetTrendingCoinsQuery,
  useSearchCoinsQuery,
  useLazyGetCoinsByIdsQuery,
} from "./features/tokens/tokensApi";
import type { SearchResult } from "./features/search/types";

const AppContent = () => {
  const dispatch = useAppDispatch();

  // --- Search / Trending ---
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: trending } = useGetTrendingCoinsQuery();
  const { data: searchResults } = useSearchCoinsQuery(query, { skip: !query });

  // Always work with array of coins
  const listToShow = query ? searchResults || [] : trending || [];

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // --- Lazy fetch selected coins ---
  const [triggerGetCoinsByIds, { data: fetchedTokens, isLoading }] =
    useLazyGetCoinsByIdsQuery();

  const handleAddSelected = () => {
    if (selectedIds.length === 0) return;
    triggerGetCoinsByIds(selectedIds);
    setSelectedIds([]);
  };

  // Add fetched tokens to watchlist
  useEffect(() => {
    if (fetchedTokens?.length) {
      dispatch(addTokens(fetchedTokens));
    }
  }, [fetchedTokens, dispatch]);

  // --- Watchlist / Portfolio ---
  const watchlist = useAppSelector(selectWatchlist);
  const total = useAppSelector(selectPortfolioTotal);
  const chartData = useAppSelector(selectChartData);
  const lastUpdated = useAppSelector(selectLastUpdated);

  // --- Edit holdings state ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newHoldings, setNewHoldings] = useState<number>(0);

  const startEdit = (coinId: string, currentHoldings: number) => {
    setEditingId(coinId);
    setNewHoldings(currentHoldings);
  };

  const saveEdit = () => {
    if (editingId !== null) {
      dispatch(updateHoldings({ coinId: editingId, holdings: newHoldings }));
      setEditingId(null);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Search / Trending */}
      <h2>Search Coins</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search coin..."
        style={{ padding: 5, marginBottom: 10 }}
      />
      <div>
        {listToShow.map((c) => (
          <div
            key={c.id}
            style={{ display: "flex", alignItems: "center", margin: 5 }}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(c.id)}
              onChange={() => toggleSelect(c.id)}
            />
            <img
              src={c.image}
              alt=""
              width={20}
              height={20}
              style={{ marginLeft: 5 }}
            />
            <span style={{ marginLeft: 5 }}>{c.name}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddSelected}
        disabled={selectedIds.length === 0 || isLoading}
        style={{ marginTop: 10 }}
      >
        {isLoading ? "Adding..." : `Add Selected (${selectedIds.length})`}
      </button>

      {/* Watchlist Table */}
      <h2>Watchlist</h2>
      <table
        style={{ borderCollapse: "collapse", width: "100%", marginTop: 10 }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: 5 }}>Name</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 5 }}>
              Holdings
            </th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 5 }}>
              Value
            </th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 5 }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map((t) => (
            <tr key={t.coinId}>
              <td style={{ padding: 5 }}>{t.name}</td>
              <td style={{ padding: 5 }}>
                {editingId === t.coinId ? (
                  <input
                    type="number"
                    value={newHoldings}
                    onChange={(e) => setNewHoldings(Number(e.target.value))}
                  />
                ) : (
                  t.holdings
                )}
              </td>
              <td style={{ padding: 5 }}>${t.value.toFixed(2)}</td>
              <td style={{ padding: 5 }}>
                {editingId === t.coinId ? (
                  <button onClick={saveEdit}>Save</button>
                ) : (
                  <>
                    <button onClick={() => startEdit(t.coinId, t.holdings)}>
                      Edit Holdings
                    </button>
                    <button onClick={() => dispatch(deleteToken(t.coinId))}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Portfolio */}
      <h2>Portfolio Total: ${total.toFixed(2)}</h2>
      <h3>Last Updated: {new Date(lastUpdated).toLocaleString()}</h3>

      <PieChart width={400} height={200}>
        <Pie
          data={chartData}
          dataKey="percentage"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
          innerRadius={30}
        >
          {chartData.map((entry) => (
            <Cell key={entry.id} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      <div>
        {chartData.map((d) => (
          <div key={d.id} style={{ color: d.color }}>
            {`${d.name}: (${d.percentage.toFixed(1)}%)`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppContent;
