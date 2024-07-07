import { inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useCallback, useEffect, useState } from "react";

type BibliotecaFilters = z.infer<typeof inputGetBooks>;
type OrderByType = z.infer<typeof inputGetBooks>["orderBy"];
type PageSizeType = z.infer<typeof inputGetBooks>["pageSize"];

const createQueryString = (filters: BibliotecaFilters) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

const changeSorting = (filters: BibliotecaFilters, newSorting: SortingState): BibliotecaFilters => {
  const newFilters: BibliotecaFilters = {
    ...filters,
    orderBy: newSorting[0]?.id as OrderByType,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
  };

  const filtersTyped = inputGetBooks.parse(newFilters);

  return filtersTyped;
};

const changePagination = (filters: BibliotecaFilters, newPagination: PaginationState): BibliotecaFilters => {
  const newFilters: BibliotecaFilters = {
    ...filters,
    pageIndex: (newPagination.pageIndex + 1).toString(),
    pageSize: newPagination.pageSize.toString() as PageSizeType,
  };

  const filtersTyped = inputGetBooks.parse(newFilters);

  return filtersTyped;
};

const getPagination = (filters: BibliotecaFilters): { pageSize: number; pageIndex: number } => {
  const { pageIndex, pageSize } = filters;

  return { pageIndex: parseInt(pageIndex), pageSize: parseInt(pageSize) };
};

const getSorting = (filters: BibliotecaFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const useBibliotecaQueryParam = (filters: BibliotecaFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>(getSorting(filters));
  const [pagination, setPagination] = useState<PaginationState>(getPagination(filters));

  const changeQueryParams = useCallback(
    (filters: BibliotecaFilters) => {
      router.push(pathname + "?" + createQueryString(filters));
    },
    [pathname, router],
  );

  useEffect(() => {
    const newFilters = changeSorting(filters, sorting);
    console.log(`### Sorting changed: `, { sorting, newFilters });
    changeQueryParams(newFilters);
  }, [changeQueryParams, sorting]);

  useEffect(() => {
    const newFilters = changePagination(filters, pagination);
    console.log(`### Pagination changed: `, { pagination, newFilters });
    changeQueryParams(newFilters);
  }, [changeQueryParams, pagination]);

  return {
    refresh: () => router.refresh(),
    pagination,
    sorting,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  };
};
