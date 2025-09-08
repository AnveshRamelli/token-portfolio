import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { LineChart, Line } from "recharts";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { selectWatchlist } from "../features/portfolio/portfolioSelectors";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addTokens,
  updateHoldings,
  deleteToken,
} from "../features/tokens/tokensSlice";
import { useEffect, useState } from "react";
import { useLazyGetCoinsByIdsQuery } from "../features/tokens/tokensApi";

const WatchlistTable = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectWatchlist);
  const [fetchCoins, { data: fetchedTokens }] = useLazyGetCoinsByIdsQuery();
  const watchlistIds = useAppSelector(selectWatchlist).map(
    (token) => token.coinId
  );

  // local state for editing holdings
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    if (watchlistIds.length > 0) {
      fetchCoins(watchlistIds);
    }
  }, []);

  useEffect(() => {
    if (fetchedTokens?.length) {
      dispatch(addTokens(fetchedTokens));
    }
  }, [fetchedTokens, dispatch]);

  const handleSave = (coinId: string) => {
    dispatch(updateHoldings({ coinId, holdings: Number(editValue) }));
    setEditingRow(null);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Token",
      cell: ({ row }) => {
        const token = row.original;
        return (
          <div className="flex gap-2 items-center">
            <img src={token.image} alt={token.name} className="h-6 w-6" />
            <span className="font-medium">{token.name}</span>
            <span className="text-sm">({token.symbol.toUpperCase()})</span>
          </div>
        );
      },
    },
    {
      accessorKey: "currentPrice",
      header: "Price",
      cell: ({ row }) => <span>${row.original.currentPrice}</span>,
    },
    {
      accessorKey: "priceChange24h",
      header: "24h %",
      cell: ({ row }) => {
        const value = row.original.priceChange24h;
        return (
          <span className={value >= 0 ? "text-green-500" : "text-red-500"}>
            {value > 0 ? "+" : ""}
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "sparkline",
      header: "Sparkline (7d)",
      cell: ({ row }) => {
        const sparkline = row.original.sparkline || [];
        const data = sparkline.map((y: number, i: number) => ({ x: i, y }));
        const color = row.original.priceChange24h >= 0 ? "#32CA5B" : "#FF3A33";
        return (
          <LineChart width={100} height={40} data={data}>
            <Line
              type="monotone"
              dataKey="y"
              stroke={color}
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        );
      },
    },
    {
      accessorKey: "holdings",
      header: "Holdings",
      cell: ({ row }) => {
        const token = row.original;
        const isEditing = editingRow === token.coinId;

        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={editValue}
                variant="highlight"
                onChange={(e) => setEditValue(e.target.value)}
                className="w-24 h-8"
              />
              <Button
                size="sm"
                className="bg-accent  hover:bg-accent cursor-pointer text-black"
                onClick={() => handleSave(token.coinId)}
              >
                Save
              </Button>
            </div>
          );
        }

        return <span className="text-muted">{token.holdings || "-"}</span>;
      },
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => (
        <span className="text-muted">
          {row.original.value.toFixed(2) || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const token = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="cursor-pointer">
                <MoreHorizontal className="h-4 w-4 text-muted" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span
                  className="flex items-center gap-2 text-sm p-2 text-muted cursor-pointer"
                  onClick={() => {
                    setEditingRow(token.coinId);
                    setEditValue(
                      token.holdings ? token.holdings.toString() : ""
                    );
                  }}
                >
                  <Pencil className="h-4 w-4" /> Edit Holdings
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span
                  className="flex items-center gap-2 text-sm p-2 text-red-500 cursor-pointer hover:bg-outer"
                  onClick={() => {
                    dispatch(deleteToken(token.coinId));
                  }}
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-xl border border-gray-700 bg-inner">
      <Table className="text-muted">
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="bg-outer">
          {table.getRowModel().rows.map((r) => (
            <TableRow key={r.id}>
              {r.getVisibleCells().map((c) => (
                <TableCell key={c.id}>
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-2 py-3 text-sm text-muted">
        <div>
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          –{" "}
          {(table.getState().pagination.pageIndex + 1) *
            table.getState().pagination.pageSize}{" "}
          of {data.length} results
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <span>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()} pages
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WatchlistTable;
