// src/components/AddTokenModal.tsx
import { useState, useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { addTokens } from "../features/tokens/tokensSlice";
import {
  useLazyGetCoinsByIdsQuery,
} from "../features/tokens/tokensApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { useGetTrendingCoinsQuery, useSearchCoinsQuery } from "../features/search/searchApi";

const AddTokenModal = () => {
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // --- API hooks ---
  const { data: trending } = useGetTrendingCoinsQuery();
  const { data: searchResults } = useSearchCoinsQuery(query, { skip: !query });
  const listToShow = query ? searchResults || [] : trending || [];
  debugger;

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
      <DialogTrigger asChild>
        <button className="btn primary-btn rounded-sm">Add Token</button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        {/* Header */}
        <DialogHeader className="bg-inner-bg p-3">
          <Input
            id="search"
            placeholder="Search tokens (e.g., ETH, SOL)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </DialogHeader>

        {/* Token list */}
        <ScrollArea className="mt-4 h-54 rounded-md bg-outer-bg">
          <div className="">
            {listToShow.map((c: any) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-inner-bg"
              >
                <div className="flex items-center gap-2">
                  <img src={c.image} alt={c.name} className="h-6 w-6 rounded-full" />
                  <span className="text-sm font-medium text-foreground">
                    {c.name} ({c.symbol})
                  </span>
                </div>
                <div className=''>
<input
                  type="checkbox"  
                  className={`rounded-full ${
                    selectedIds.includes(c.id) ? "accent" : ""
                  }`}
                  checked={selectedIds.includes(c.id)}
                  onChange={() => toggleSelect(c.id)}
                />
                </div>
                
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="bg-inner-bg mt-4 p-3 flex justify-end">
          <button
            className="primary-btn"
            disabled={selectedIds.length === 0 || isLoading}
            onClick={handleAddSelected}
          >
            Add to Watchlist
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTokenModal;
