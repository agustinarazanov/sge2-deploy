import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { inputGetCursos } from "@/shared/filters/cursos-filter.schema";

type CursosFilters = z.infer<typeof inputGetCursos>;
type OrderByType = z.infer<typeof inputGetCursos>["orderBy"];
type PageSizeType = z.infer<typeof inputGetCursos>["pageSize"];

const createQueryString = (filters: CursosFilters) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

const changeSorting = (filters: CursosFilters, newSorting: SortingState): CursosFilters => {
  const newFilters: CursosFilters = {
    ...filters,
    orderBy: newSorting[0]?.id as OrderByType,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
    pageIndex: "0",
  };

  const filtersTyped = inputGetCursos.parse(newFilters);

  return filtersTyped;
};

const changePagination = (filters: CursosFilters, newPagination: PaginationState): CursosFilters => {
  const newFilters: CursosFilters = {
    ...filters,
    pageIndex: newPagination.pageIndex.toString(),
    pageSize: newPagination.pageSize.toString() as PageSizeType,
  };

  const filtersTyped = inputGetCursos.parse(newFilters);

  return filtersTyped;
};

const changeSearchText = (filters: CursosFilters, searchText: string): CursosFilters => {
  const newFilters: CursosFilters = {
    ...filters,
    searchText,
    pageIndex: "0",
  };

  const filtersTyped = inputGetCursos.parse(newFilters);

  return filtersTyped;
};

const changeMateria = (filters: CursosFilters, materia: string): CursosFilters => {
  const newFilters: CursosFilters = {
    ...filters,
    materia,
    pageIndex: "0",
  };

  const filtersTyped = inputGetCursos.parse(newFilters);

  return filtersTyped;
};

const getPagination = (filters: CursosFilters): { pageSize: number; pageIndex: number } => {
  const { pageIndex, pageSize } = filters;

  return { pageIndex: parseInt(pageIndex), pageSize: parseInt(pageSize) };
};

const getSorting = (filters: CursosFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const useCursosQueryParam = (filters: CursosFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const sorting = getSorting(filters);
  const pagination = getPagination(filters);
  const searchText = filters.searchText;
  const materia = filters.materia;

  const changeQueryParams = useCallback(
    (filters: CursosFilters) => {
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

  const onMateriaChange = useCallback(
    (materia: string) => {
      const newFilters = changeMateria(filters, materia);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  return {
    refresh: () => router.refresh(),
    pagination,
    sorting,
    searchText,
    materia,
    onSortingChange,
    onPaginationChange,
    onSearchTextChange,
    onMateriaChange,
  };
};
