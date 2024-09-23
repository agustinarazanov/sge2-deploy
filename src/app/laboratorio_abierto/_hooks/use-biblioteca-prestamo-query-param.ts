import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { inputGetAllPrestamosLibros } from "@/shared/filters/reservas-filter.schema";
import { type RouterOutputs } from "@/trpc/react";

type EstadoReservaType =
  RouterOutputs["reservas"]["reservaBiblioteca"]["getAll"]["reservas"][number]["reserva"]["estatus"];
type BibliotecaPrestamoFilters = z.infer<typeof inputGetAllPrestamosLibros>;
type OrderByType = BibliotecaPrestamoFilters["orderBy"];
type PageSizeType = BibliotecaPrestamoFilters["pageSize"];

const createQueryString = (filters: BibliotecaPrestamoFilters) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

const changeSorting = (filters: BibliotecaPrestamoFilters, newSorting: SortingState): BibliotecaPrestamoFilters => {
  const newFilters: BibliotecaPrestamoFilters = {
    ...filters,
    orderBy: newSorting[0]?.id as OrderByType,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllPrestamosLibros.parse(newFilters);

  return filtersTyped;
};

const changePagination = (
  filters: BibliotecaPrestamoFilters,
  newPagination: PaginationState,
): BibliotecaPrestamoFilters => {
  const newFilters: BibliotecaPrestamoFilters = {
    ...filters,
    pageIndex: newPagination.pageIndex.toString(),
    pageSize: newPagination.pageSize.toString() as PageSizeType,
  };

  const filtersTyped = inputGetAllPrestamosLibros.parse(newFilters);

  return filtersTyped;
};

const changeSearchText = (filters: BibliotecaPrestamoFilters, searchText: string): BibliotecaPrestamoFilters => {
  const newFilters: BibliotecaPrestamoFilters = {
    ...filters,
    searchText,
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllPrestamosLibros.parse(newFilters);

  return filtersTyped;
};

const changeEstatus = (
  filters: BibliotecaPrestamoFilters,
  newEstatus: EstadoReservaType | "",
): BibliotecaPrestamoFilters => {
  const newFilters: BibliotecaPrestamoFilters = {
    ...filters,
    estatus: newEstatus,
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllPrestamosLibros.parse(newFilters);

  return filtersTyped;
};

const getPagination = (filters: BibliotecaPrestamoFilters): { pageSize: number; pageIndex: number } => {
  const { pageIndex, pageSize } = filters;

  return { pageIndex: parseInt(pageIndex), pageSize: parseInt(pageSize) };
};

const getSorting = (filters: BibliotecaPrestamoFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const useBibliotecaPrestamosQueryParam = (filters: BibliotecaPrestamoFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const sorting = getSorting(filters);
  const pagination = getPagination(filters);
  const searchText = filters.searchText;
  const reservaEstatus = filters.estatus;

  const changeQueryParams = useCallback(
    (filters: BibliotecaPrestamoFilters) => {
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

  const onReservaEstatusChange = useCallback(
    (reservaEstatus: EstadoReservaType | "") => {
      const newFilters = changeEstatus(filters, reservaEstatus);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  return {
    refresh: () => router.refresh(),
    pagination,
    sorting,
    searchText,
    reservaEstatus,
    onSortingChange,
    onPaginationChange,
    onSearchTextChange,
    onReservaEstatusChange,
  };
};
