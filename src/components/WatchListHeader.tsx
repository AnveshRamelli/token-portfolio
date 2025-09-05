import { useLazyGetCoinsByIdsQuery } from "../features/tokens/tokensApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectWatchlist } from "../features/portfolio/portfolioSelectors";
import AddTokenModal from "../components/AddTokenModal";
import { RefreshCcw } from "lucide-react";
import { addTokens } from "../features/tokens/tokensSlice";
import { useEffect } from "react";

const WatchListHeader = () => {
  const [fetchCoins, { data, isFetching }] = useLazyGetCoinsByIdsQuery();
  const watchlist = useAppSelector(selectWatchlist);
  const watchlistIds = watchlist.map((token) => token.coinId);
  const dispatch = useAppDispatch();

  const handleRefresh = () => {
    if (watchlistIds.length > 0) {
      fetchCoins(watchlistIds);
    }
  };

  useEffect(() => {
    if (data?.length) {
      dispatch(addTokens(data));
    }
  }, [data, dispatch]);

  return (
    <header className="mx-auto flex items-center justify-between">
      <h2 className="font-semibold text-primary sm:text-lg">Watchlist</h2>
      <div className="flex gap-2">
        <button
          className="primary-btn rounded-sm mr-2 flex items-center gap-1"
          onClick={handleRefresh}
          disabled={isFetching}
        >
          <RefreshCcw width={12} />
          {isFetching ? "Refreshing" : "Refresh Prices"}
        </button>
        <div className="z-100">
          <AddTokenModal />
        </div>
      </div>
    </header>
  );
};

export default WatchListHeader;
