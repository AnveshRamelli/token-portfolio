// const WatchListHeader = () => {
//   return (
//     <header className="mx-auto flex items-center justify-between">
//       <h2 className="font-semibold text-primary sm:text-lg">Watchlist</h2>
//       <div>
//         <button className="btn primary-btn rounded-sm mr-2">Refresh Prices</button>
//         <button className="btn primary-btn rounded-sm">Add Token</button>
//       </div>
//     </header>
//   );
// };

// export default WatchListHeader;

import { useLazyGetCoinsByIdsQuery } from "../features/tokens/tokensApi";
import { Button } from "../components/ui/button";
import AddTokenModal from "../components/AddTokenModal";
import { useAppSelector } from "../app/hooks";
import { selectWatchlist } from "../features/portfolio/portfolioSelectors";
import AddTokenModal2 from "./AddTokenModal2";

const WatchListHeader = () => {
  // Lazy query hook initialized at top level
  const [fetchCoins, { data, isFetching }] = useLazyGetCoinsByIdsQuery();
  const tokens = useAppSelector(selectWatchlist);

  const handleRefresh = () => {
    if (tokens.length > 0) {
      fetchCoins(tokens.map((token) => token.coinId)); // trigger re-fetch for the given IDs
    }
  };

  return (
    <header className="mx-auto flex items-center justify-between">
      <h2 className="font-semibold text-primary sm:text-lg">Watchlist</h2>
      <div className="flex gap-2">
        <button
          className="btn primary-btn rounded-sm mr-2 onClick={handleRefresh}
          disabled={isFetching}"
        >
          {isFetching ? "Refreshing..." : "Refresh Prices"}
        </button>
        <div className="z-100">
          <AddTokenModal2 />
        </div>
      </div>
    </header>
  );
};

export default WatchListHeader;
