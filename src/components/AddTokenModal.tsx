import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addTokens } from "../features/tokens/tokensSlice";
import { useLazyGetCoinsByIdsQuery } from "../features/tokens/tokensApi";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  useGetTrendingCoinsQuery,
  useSearchCoinsQuery,
} from "../features/search/searchApi";
import { Plus, Star } from "lucide-react";
import { selectWatchlist } from "../features/portfolio/portfolioSelectors";

const AddTokenModal = () => {
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const watchlist = useAppSelector(selectWatchlist);

  const { data: trending } = useGetTrendingCoinsQuery();
  const { data: searchResults } = useSearchCoinsQuery(query, { skip: !query });
  const listToShow = query ? searchResults || [] : trending || [];

  const [triggerGetCoinsByIds, { data: fetchedTokens, isLoading }] =
    useLazyGetCoinsByIdsQuery();

  const isInWatchlist = (id: string) =>
    watchlist.some((token) => token.coinId === id);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddSelected = () => {
    if (selectedIds.length === 0) return;
    triggerGetCoinsByIds(selectedIds);
  };

  useEffect(() => {
    if (fetchedTokens?.length) {
      dispatch(addTokens(fetchedTokens));
      setSelectedIds([]);
      setQuery("");
      setOpen(false);
    }
  }, [fetchedTokens, dispatch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle> </DialogTitle>
      <DialogTrigger>
        <span className="btn primary-btn rounded-sm flex items-center gap-1">
          <Plus width={12} />
          Add Token
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="bg-inner">
          <Input
            className="text-muted"
            id="search"
            placeholder="Search tokens (e.g., ETH, SOL)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </DialogHeader>

        <ScrollArea className="h-54 rounded-md bg-outer-bg">
          <div className="">
            {!query && <span className="text-muted text-xs px-2">trendig</span>}
            {listToShow.map((coin: any) => (
              <div
                key={coin.coinId}
                className="flex items-center justify-between p-2 rounded-md hover:bg-outer cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-muted">
                    {coin.name} ({coin.symbol})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isInWatchlist(coin.coinId) && (
                    <Star className="w-3 h-3 text-accent fill-accent" />
                  )}
                  <Input
                    type="checkbox"
                    className={`rounded-full h-4 w-4 ${
                      selectedIds.includes(coin.coinId) ? "accent" : ""
                    }`}
                    checked={
                      selectedIds.includes(coin.coinId) ||
                      isInWatchlist(coin.coidId)
                    }
                    onChange={() => toggleSelect(coin.coinId)}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <div className="bg-inner flex justify-end">
            <button
              className={`${
                selectedIds.length === 0
                  ? "secondary-btn cursor-not-allowed"
                  : "primary-btn"
              } rounded-sm`}
              disabled={selectedIds.length === 0 || isLoading}
              onClick={handleAddSelected}
            >
              Add to Watchlist
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTokenModal;
