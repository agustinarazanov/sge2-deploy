"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select";
import { Button } from "@/components/ui/button";
import { type PaginationState } from "@tanstack/react-table";

interface DataTablePaginationProps {
  pageSize: number;
  pageIndex: number;
  rowCount: number;
  onChange: (pagination: PaginationState) => void;
}

export function DataTablePaginationStandalone(props: DataTablePaginationProps) {
  const { pageSize = 10, pageIndex = 0, rowCount = 0, onChange } = props ?? {};

  const pageCount = Math.ceil(rowCount / pageSize);

  const canPreviousPage = pageIndex > 0;

  const canNextPage = pageIndex < pageCount - 1;

  const setPageSize = (newPageSize: number) => onChange({ pageIndex, pageSize: newPageSize });

  const setPageIndex = (newPageIndex: number) => onChange({ pageIndex: newPageIndex, pageSize });

  const previousPage = () => setPageIndex(pageIndex - 1);

  const nextPage = () => setPageIndex(pageIndex + 1);

  return (
    <div className="flex items-center justify-center px-2 sm:mt-4">
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-3 sm:space-y-0 lg:space-x-8">
        {rowCount > 0 && (
          <p className="text-sm font-medium">
            {rowCount} {rowCount === 1 ? "resultado" : "resultados"}
          </p>
        )}
        {pageSize && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex w-[110px] items-center justify-center text-sm font-medium">
          Página {pageIndex + 1} de {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="icon"
            color="secondary"
            icon={ChevronsLeft}
            size="sm"
            className="hidden lg:flex"
            onClick={() => setPageIndex(0)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Ir a la primera página</span>
          </Button>
          <Button
            variant="icon"
            color="secondary"
            icon={ChevronLeft}
            size="sm"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Ir a la página anterior</span>
          </Button>
          <Button
            variant="icon"
            color="secondary"
            icon={ChevronRight}
            size="sm"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <span className="sr-only">Ir a la próxima página</span>
          </Button>
          <Button
            variant="icon"
            color="secondary"
            icon={ChevronsRight}
            size="sm"
            className="hidden lg:flex"
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Ir a la última página</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
