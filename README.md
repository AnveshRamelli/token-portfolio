# 🪙 Token Portfolio

A responsive token portfolio dashboard built with **React + Vite + Redux Toolkit**, styled with **Tailwind + shadcn/ui**, and integrated with **CoinGecko API** + **RainbowKit Wallet Connect**.

The app allows users to connect a wallet, manage a token watchlist, track portfolio value in real-time, and view visual insights through a donut chart and sparklines.

### 1. Portfolio dashboard

- Portfolio Total card with donut chart (colors match tokens).
  Watchlist table with:
  - Token (logo, name, symbol)
  - Price (from CoinGecko)
  - 24h % change (red/green)
  - 7d sparkline chart
  - Editable holdings
  - Calculated Value (holdings × price)
  - Row menu with actions
- Refresh Prices button to reload data.
- Pagination footer for table.

### 2. Add Token (Modal)

- Search tokens via CoinGecko API.
- Trending section.
- Each row: logo, name, symbol, select radio.
- Footer button **“Add to Watchlist”** enabled when at least 1 token is selected.
- On save, tokens appear in Watchlist.

### 3. State, Data & Persistence

- Global state with **Redux Toolkit**.
- RTK Qyery for fetching data from APIs
- Watchlist + holdings persisted in **localStorage**.
- Portfolio Total auto-updates with latest prices.
- Computed values:
  - `Value = holdings × price`
  - `Portfolio Total = sum(values)`

### 4. Wallet Connection

- Integrated with **wagmi + RainbowKit**.
- On connect → shows connected wallet address.
- Watchlist restores from localStorage.

## Tech Stack

- **React + Vite**
- **Redux Toolkit** (state management)
- **Tailwind CSS + shadcn/ui** (UI styling & components)
- **Recharts** (donut + sparkline charts)
- **CoinGecko API** (token data)
- **wagmi + RainbowKit** (wallet connection)
