// src/App.tsx
import React from "react";
import Navbar from "./components/Navbar";
import WatchListHeader from "./components/WatchListHeader";
import PortfolioSummary from "./components/PortfoliioSummary";
import PortfolioChart from "./components/PortfolioChart";
import WatchlistTable from "./components/WatchListTable";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-outer">
      <Navbar />
      <main className="mx-auto py-4 px-7">
        <section className="flex flex-col md:flex-row bg-inner shadow-md rounded-md p-4 gap-4">
          <div className="card flex-1">
            <PortfolioSummary />
          </div>
          <div className="card flex-1">
            <PortfolioChart />
          </div>
        </section>

        <section className="mt-10">
          <WatchListHeader />
        </section>

        <section className="mt-5 bg-outer">
          <WatchlistTable />
        </section>
      </main>
    </div>
  );
};

export default App;
