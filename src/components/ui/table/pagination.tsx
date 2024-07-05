"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select";
import { Button } from "@/components/ui/button";

export type PaginationConfig = {
  selectedRows?: boolean;
  pageSize?: boolean;
  pageNumber?: boolean;
};

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  config?: PaginationConfig;
}

export function DataTablePagination<TData>({ table, config }: DataTablePaginationProps<TData>) {
  const { selectedRows = true, pageSize = true, pageNumber = true } = config || {};
  return (
    <div className="mt-4 flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedRows && (
          <>
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </>
        )}
      </div>
      <div className="flex items-center space-x-3 lg:space-x-8">
        {pageSize && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {pageNumber && (
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button
            variant="icon"
            color="secondary"
            icon={ChevronsLeft}
            size="sm"
            className="hidden lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
          </Button>
          <Button
            variant="icon"
            color="secondary"
            icon={ChevronLeft}
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
          </Button>
          <Button
            variant="icon"
            color="secondary"
            icon={ChevronRight}
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
          </Button>
          <Button
            variant="icon"
            color="secondary"
            icon={ChevronsRight}
            size="sm"
            className="hidden lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
