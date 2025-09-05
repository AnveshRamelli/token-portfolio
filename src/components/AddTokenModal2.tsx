// src/components/AddTokenModal.tsx
import { useState, useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { addTokens } from "../features/tokens/tokensSlice";
import { useLazyGetCoinsByIdsQuery } from "../features/tokens/tokensApi";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  useGetTrendingCoinsQuery,
  useSearchCoinsQuery,
} from "../features/search/searchApi";
import { Plus } from "lucide-react";

const AddTokenModal = () => {
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // --- API hooks ---
  const { data: trending } = useGetTrendingCoinsQuery();
  const { data: searchResults } = useSearchCoinsQuery(query, { skip: !query });
  const listToShow = query ? searchResults || [] : trending || [];

  const [triggerGetCoinsByIds, { data: fetchedTokens, isLoading }] =
    useLazyGetCoinsByIdsQuery();

  // --- Toggle selection ---
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // --- Add selected tokens ---
  const handleAddSelected = () => {
    if (selectedIds.length === 0) return;
    triggerGetCoinsByIds(selectedIds);
  };

  // --- Save to Redux when tokens fetched ---
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
      <DialogTrigger>
        <span className="btn primary-btn rounded-sm flex items-center gap-1">
          <Plus width={12} />
          Add Token
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        {/* Header */}
        <DialogHeader className="bg-inner-bg">
          <Input
            className="text-muted"
            id="search"
            placeholder="Search tokens (e.g., ETH, SOL)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </DialogHeader>

        {/* Token list */}
        <ScrollArea className="h-54 rounded-md bg-outer-bg">
          <div className="">
            {!query && <span className="text-muted text-xs px-2">trendig</span>}
            {listToShow.map((c: any) => (
              <div
                key={c.coinId}
                className="flex items-center justify-between p-2 rounded-md hover:bg-outer cursor-pointer"
                //  onClick={()=> toggleSelect(c.coinId)}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-muted">
                    {c.name} ({c.symbol})
                  </span>
                </div>
                <div className="">
                  <Input
                    type="checkbox"
                    className={`rounded-full ${
                      selectedIds.includes(c.coinId) ? "accent" : ""
                    }`}
                    checked={selectedIds.includes(c.coinId)}
                    onChange={() => toggleSelect(c.coinId)}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <div className="bg-inner flex justify-end">
            <button
              className={`${selectedIds.length === 0 ?'secondary-btn cursor-not-allowed': 'primary-btn' } rounded-sm`}
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
