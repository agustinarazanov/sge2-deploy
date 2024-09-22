import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { type RouterOutputs } from "@/trpc/react";
import { inputGetAllPrestamosEquipos } from "@/shared/filters/reservas-equipos-filter.schema";

type EstadoReservaType = RouterOutputs["reservas"]["reservaEquipo"]["getAll"]["reservas"][number]["reserva"]["estatus"];
type EquiposPrestamoFilters = z.infer<typeof inputGetAllPrestamosEquipos>;
type OrderByType = EquiposPrestamoFilters["orderBy"];
type PageSizeType = EquiposPrestamoFilters["pageSize"];

const createQueryString = (filters: EquiposPrestamoFilters) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

const changeSorting = (filters: EquiposPrestamoFilters, newSorting: SortingState): EquiposPrestamoFilters => {
  const newFilters: EquiposPrestamoFilters = {
    ...filters,
    orderBy: newSorting[0]?.id as OrderByType,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllPrestamosEquipos.parse(newFilters);

  return filtersTyped;
};

const changePagination = (filters: EquiposPrestamoFilters, newPagination: PaginationState): EquiposPrestamoFilters => {
  const newFilters: EquiposPrestamoFilters = {
    ...filters,
    pageIndex: newPagination.pageIndex.toString(),
    pageSize: newPagination.pageSize.toString() as PageSizeType,
  };

  const filtersTyped = inputGetAllPrestamosEquipos.parse(newFilters);

  return filtersTyped;
};

const changeSearchText = (filters: EquiposPrestamoFilters, searchText: string): EquiposPrestamoFilters => {
  const newFilters: EquiposPrestamoFilters = {
    ...filters,
    searchText,
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllPrestamosEquipos.parse(newFilters);

  return filtersTyped;
};

const changeEstatus = (filters: EquiposPrestamoFilters, newEstatus: EstadoReservaType | ""): EquiposPrestamoFilters => {
  const newFilters: EquiposPrestamoFilters = {
    ...filters,
    estatus: newEstatus,
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllPrestamosEquipos.parse(newFilters);

  return filtersTyped;
};

const getPagination = (filters: EquiposPrestamoFilters): { pageSize: number; pageIndex: number } => {
  const { pageIndex, pageSize } = filters;

  return { pageIndex: parseInt(pageIndex), pageSize: parseInt(pageSize) };
};

const getSorting = (filters: EquiposPrestamoFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const useEquiposPrestamosQueryParam = (filters: EquiposPrestamoFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const sorting = getSorting(filters);
  const pagination = getPagination(filters);
  const searchText = filters.searchText;
  const reservaEstatus = filters.estatus;

  const changeQueryParams = useCallback(
    (filters: EquiposPrestamoFilters) => {
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
