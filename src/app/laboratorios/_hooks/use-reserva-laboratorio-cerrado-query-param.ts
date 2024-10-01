import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { type RouterOutputs } from "@/trpc/react";
import { inputGetAllSolicitudesReservaLaboratorioCerrado } from "@/shared/filters/reserva-laboratorio-filter.schema";

type EstadoReservaType =
  RouterOutputs["reservas"]["reservarLaboratorioCerrado"]["getAll"]["reservas"][number]["reserva"]["estatus"];
type resevaLaboratorioCerradoFilters = z.infer<typeof inputGetAllSolicitudesReservaLaboratorioCerrado>;
type OrderByType = resevaLaboratorioCerradoFilters["orderBy"];
type PageSizeType = resevaLaboratorioCerradoFilters["pageSize"];

const createQueryString = (filters: resevaLaboratorioCerradoFilters) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

const changeSorting = (
  filters: resevaLaboratorioCerradoFilters,
  newSorting: SortingState,
): resevaLaboratorioCerradoFilters => {
  const newFilters: resevaLaboratorioCerradoFilters = {
    ...filters,
    orderBy: newSorting[0]?.id as OrderByType,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllSolicitudesReservaLaboratorioCerrado.parse(newFilters);

  return filtersTyped;
};

const changePagination = (
  filters: resevaLaboratorioCerradoFilters,
  newPagination: PaginationState,
): resevaLaboratorioCerradoFilters => {
  const newFilters: resevaLaboratorioCerradoFilters = {
    ...filters,
    pageIndex: newPagination.pageIndex.toString(),
    pageSize: newPagination.pageSize.toString() as PageSizeType,
  };

  const filtersTyped = inputGetAllSolicitudesReservaLaboratorioCerrado.parse(newFilters);

  return filtersTyped;
};

const changeSearchText = (
  filters: resevaLaboratorioCerradoFilters,
  searchText: string,
): resevaLaboratorioCerradoFilters => {
  const newFilters: resevaLaboratorioCerradoFilters = {
    ...filters,
    searchText,
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllSolicitudesReservaLaboratorioCerrado.parse(newFilters);

  return filtersTyped;
};

const changeEstatus = (
  filters: resevaLaboratorioCerradoFilters,
  newEstatus: EstadoReservaType | "",
): resevaLaboratorioCerradoFilters => {
  const newFilters: resevaLaboratorioCerradoFilters = {
    ...filters,
    estatus: newEstatus,
    pageIndex: "0",
  };

  const filtersTyped = inputGetAllSolicitudesReservaLaboratorioCerrado.parse(newFilters);

  return filtersTyped;
};

const getPagination = (filters: resevaLaboratorioCerradoFilters): { pageSize: number; pageIndex: number } => {
  const { pageIndex, pageSize } = filters;

  return { pageIndex: parseInt(pageIndex), pageSize: parseInt(pageSize) };
};

const getSorting = (filters: resevaLaboratorioCerradoFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const useReservasLaboratorioCerradoQueryParam = (filters: resevaLaboratorioCerradoFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const sorting = getSorting(filters);
  const pagination = getPagination(filters);
  const searchText = filters.searchText;
  const reservaEstatus = filters.estatus;

  const changeQueryParams = useCallback(
    (filters: resevaLaboratorioCerradoFilters) => {
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
