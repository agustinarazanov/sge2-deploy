import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { type RouterOutputs } from "@/trpc/react";
import { inputGetAllSolicitudesReservaLaboratorioAbierto } from "@/shared/filters/reserva-laboratorio-filter.schema";

type EstadoReservaType =
  RouterOutputs["reservas"]["reservaLaboratorioAbierto"]["getAll"]["reservas"][number]["reserva"]["estatus"];
type resevaLaboratorioAbiertoFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioAbierto>;
type OrderByType = resevaLaboratorioAbiertoFilters["orderBy"];
type PageSizeType = resevaLaboratorioAbiertoFilters["pageSize"];

const createQueryString = (filters: resevaLaboratorioAbiertoFilters) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

const changeSorting = (
  filters: resevaLaboratorioAbiertoFilters,
  newSorting: SortingState,
): resevaLaboratorioAbiertoFilters => {
  const newFilters: resevaLaboratorioAbiertoFilters = {
    ...filters,
    orderBy: newSorting[0]?.id as OrderByType,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllSolicitudesReservaLaboratorioAbierto.parse(newFilters);

  return filtersTyped;
};

const changePagination = (
  filters: resevaLaboratorioAbiertoFilters,
  newPagination: PaginationState,
): resevaLaboratorioAbiertoFilters => {
  const newFilters: resevaLaboratorioAbiertoFilters = {
    ...filters,
    pageIndex: newPagination.pageIndex.toString(),
    pageSize: newPagination.pageSize.toString() as PageSizeType,
  };

  const filtersTyped = inputGetAllSolicitudesReservaLaboratorioAbierto.parse(newFilters);

  return filtersTyped;
};

const changeSearchText = (
  filters: resevaLaboratorioAbiertoFilters,
  searchText: string,
): resevaLaboratorioAbiertoFilters => {
  const newFilters: resevaLaboratorioAbiertoFilters = {
    ...filters,
    searchText,
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllSolicitudesReservaLaboratorioAbierto.parse(newFilters);

  return filtersTyped;
};

const changeEstatus = (
  filters: resevaLaboratorioAbiertoFilters,
  newEstatus: EstadoReservaType | "",
): resevaLaboratorioAbiertoFilters => {
  const newFilters: resevaLaboratorioAbiertoFilters = {
    ...filters,
    estatus: newEstatus,
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllSolicitudesReservaLaboratorioAbierto.parse(newFilters);

  return filtersTyped;
};

const getPagination = (filters: resevaLaboratorioAbiertoFilters): { pageSize: number; pageIndex: number } => {
  const { pageIndex, pageSize } = filters;

  return { pageIndex: parseInt(pageIndex), pageSize: parseInt(pageSize) };
};

const getSorting = (filters: resevaLaboratorioAbiertoFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const useReservasLaboratorioAbiertoQueryParam = (filters: resevaLaboratorioAbiertoFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const sorting = getSorting(filters);
  const pagination = getPagination(filters);
  const searchText = filters.searchText;
  const reservaEstatus = filters.estatus;

  const changeQueryParams = useCallback(
    (filters: resevaLaboratorioAbiertoFilters) => {
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
