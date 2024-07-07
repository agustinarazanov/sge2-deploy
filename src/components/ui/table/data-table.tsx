"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type TableState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";

import { cn } from "@/components/utils";
import { DataTablePagination, type PaginationConfig } from "./pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

interface DataTableProps<TData> {
  manualSorting?: boolean;
  manualPagination?: boolean;
  pageSize?: number;
  pageIndex?: number;
  rowCount?: number;
  columns: ColumnDef<TData>[];
  data: TData[];
  onRowClick?: (row: Row<TData>) => void;
  paginationConfig?: PaginationConfig;
  config?: Config;
  initialState?: Pick<TableState, "pagination">;
  action?: {
    header?: string;
    classNames?: string;
    cell?: (row: Row<TData>) => ReactNode;
  };
}

const getAlignment = (align?: string) => {
  switch (align) {
    case "center":
      return cn("text-center");
    case "right":
      return cn("text-right");
  }
  return cn("text-left");
};

type Meta = {
  header?: {
    align?: "left" | "center" | "right";
    hideSort?: boolean;
    className?: string;
  };
  cell?: {
    align?: "left" | "center" | "right";
    className?: string;
  };
};

type Config = {
  containerClass?: string;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  rowSelection?: Record<number, boolean>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  emptyComponent?: React.ReactNode;
  isLoading?: boolean;
};

const getMeta = <T,>(column: Column<T, unknown>): Meta | null => {
  const meta = column.columnDef.meta;
  if (!meta) null;
  return meta as Meta;
};

export function DataTable<T>({
  data,
  paginationConfig,
  onRowClick,
  config,
  action,
  initialState,
  manualSorting,
  manualPagination,
  pageSize,
  pageIndex,
  rowCount,
  ...props
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>(
    initialState?.pagination ?? {
      pageSize: pageSize ?? 10,
      pageIndex: pageIndex ?? 0,
    },
  );

  const columns = useMemo(() => {
    return action
      ? [
          ...props.columns,
          {
            id: "action",
            header: () => action?.header ?? null,
            cell: ({ row }) => {
              return <div className="flex items-center justify-end space-x-2">{action?.cell?.(row)}</div>;
            },
          },
        ]
      : props.columns;
  }, [props.columns, action]);

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    manualSorting,
    manualPagination,
    rowCount,
    onRowSelectionChange: config?.onRowSelectionChange ?? setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: paginationConfig ? getPaginationRowModel() : undefined,
    onSortingChange: config?.onSortingChange ?? setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: config?.onPaginationChange ?? setPagination,
    state: {
      rowSelection: config?.rowSelection ?? rowSelection,
      sorting: config?.sorting ?? sorting,
      pagination,
    },
  });
  return (
    <>
      <Table containerClass={config?.containerClass}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="sticky -top-6 ">
              {headerGroup.headers.map((header) => {
                const { column } = header;
                const sortDir = column.getIsSorted();
                const meta = getMeta(column);
                const alignment = getAlignment(meta?.header?.align);
                const headerValue = flexRender(column.columnDef.header, header.getContext());
                return (
                  <TableHead key={header.id} className={cn(alignment)}>
                    {header.isPlaceholder || !column.columnDef.header || header.id === "action" ? null : (
                      <div
                        className={cn(
                          "inline-flex h-8 cursor-pointer items-center gap-2 rounded px-2 hover:bg-gray-400",
                          meta?.header?.className,
                          {
                            "-translate-x-2": (meta?.header?.align ?? "left") === "left",
                            "translate-x-2": (meta?.header?.align ?? "left") === "right",
                          },
                        )}
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      >
                        {headerValue}
                        <div className={cn("flex h-6 flex-col", meta?.header?.hideSort && "hidden")}>
                          <ChevronUp
                            className={cn("w-3 translate-y-[2px] opacity-50", sortDir === "asc" && "opacity-100")}
                          />
                          <ChevronDown
                            className={cn("w-3 -translate-y-[2px] opacity-50", sortDir === "desc" && "opacity-100")}
                          />
                        </div>
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={
                  onRowClick
                    ? () => {
                        onRowClick(row);
                      }
                    : undefined
                }
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = getMeta(cell.column);
                  const alignment = getAlignment(meta?.cell?.align);
                  return (
                    <TableCell key={cell.id} className={cn(alignment, meta?.cell?.className)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {config?.isLoading ? (
                  <div className="mx-auto flex w-min items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : config?.emptyComponent ? (
                  config.emptyComponent
                ) : (
                  "Sin resultados."
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {paginationConfig && <DataTablePagination table={table} config={paginationConfig} />}
    </>
  );
}
