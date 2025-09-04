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
import { MoreHorizontal } from "lucide-react";
import { LineChart, Line } from "recharts";
import { Button } from "./ui/button";
import type { Token } from "../features/tokens/types";  
import { selectWatchlist } from "../features/portfolio/portfolioSelectors";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateHoldings } from "../features/tokens/tokensSlice";

// ---- Table Component ----
const WatchlistTable = () => {
  const data: Token[] = useAppSelector(selectWatchlist);
  const dispatch = useAppDispatch();

  const EditHoldings = (coinId: string, holdings: number) => {
    dispatch(updateHoldings({ coinId, holdings }));
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Token",
      cell: ({ row }) => {
        const token = row.original;
        return (
          <div className="flex gap-2">
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
          <span>
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
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
      },
    },
    {
      accessorKey: "holdings",
      header: "Holdings",
      cell: ({ row }) => (
        <span className="text-muter">{row.original.holdings || "-"}</span>
      ), // empty unless you track holdings
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => (
        <span className="text-muted">{row.original.value || "-"}</span>
      ), // derived later
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            EditHoldings(row.original.coinId, 2);
          }}
        >
          <MoreHorizontal className="h-4 w-4 text-muted" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // if (isLoading) return <div className="text-gray-400">Loading...</div>;

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

      {/* Footer */}
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
