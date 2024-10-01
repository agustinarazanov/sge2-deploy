import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { inputGetTipos } from "@/shared/filters/equipos-tipos-filter.schema";

type TiposFilters = z.infer<typeof inputGetTipos>;
type OrderByType = z.infer<typeof inputGetTipos>["orderBy"];
type PageSizeType = z.infer<typeof inputGetTipos>["pageSize"];

const createQueryString = (filters: Omit<TiposFilters, "getAll">) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

const changeSorting = (filters: TiposFilters, newSorting: SortingState): TiposFilters => {
  const newFilters: TiposFilters = {
    ...filters,
    orderBy: newSorting[0]?.id as OrderByType,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
    pageIndex: "0",
  };

  const filtersTyped = inputGetTipos.parse(newFilters);

  return filtersTyped;
};

const changePagination = (filters: TiposFilters, newPagination: PaginationState): TiposFilters => {
  const newFilters: TiposFilters = {
    ...filters,
    pageIndex: newPagination.pageIndex.toString(),
    pageSize: newPagination.pageSize.toString() as PageSizeType,
  };

  const filtersTyped = inputGetTipos.parse(newFilters);

  return filtersTyped;
};

const changeSearchText = (filters: TiposFilters, searchText: string): TiposFilters => {
  const newFilters: TiposFilters = {
    ...filters,
    searchText,
    pageIndex: "0",
  };

  const filtersTyped = inputGetTipos.parse(newFilters);

  return filtersTyped;
};

const changeTipo = (filters: TiposFilters, tipoId: string): TiposFilters => {
  const newFilters: TiposFilters = {
    ...filters,
    tipoId,
  };

  const filtersTyped = inputGetTipos.parse(newFilters);

  return filtersTyped;
};

const getPagination = (filters: TiposFilters): { pageSize: number; pageIndex: number } => {
  const { pageIndex, pageSize } = filters;

  return { pageIndex: parseInt(pageIndex), pageSize: parseInt(pageSize) };
};

const getSorting = (filters: TiposFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const useTiposQueryParam = (filters: TiposFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const sorting = getSorting(filters);
  const pagination = getPagination(filters);
  const searchText = filters.searchText;
  const tipo = filters.tipoId;

  const changeQueryParams = useCallback(
    (filters: TiposFilters) => {
      router.push(pathname + "?" + createQueryString(filters));
    },
    [pathname, router],
  );

  const onSortingChange = useCallback(
    (sorting: SortingState) => {
      const newFilters = changeSorting(filters, sorting);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  const onPaginationChange = useCallback(
    (pagination: PaginationState) => {
      const newFilters = changePagination(filters, pagination);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  const onSearchTextChange = useCallback(
    (searchText: string) => {
      const newFilters = changeSearchText(filters, searchText);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  const onTipoChange = useCallback(
    (tipo: string) => {
      const newFilters = changeTipo(filters, tipo);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  return {
    refresh: () => router.refresh(),
    sorting,
    pagination,
    searchText,
    tipo,
    onSortingChange,
    onSearchTextChange,
    onPaginationChange,
    onTipoChange: onTipoChange,
  };
};
