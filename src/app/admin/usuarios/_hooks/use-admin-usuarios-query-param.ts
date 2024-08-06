import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { inputGetUsuarios } from "@/shared/filters/admin-usuarios-filter.schema";

type AdminUsuariosFilters = z.infer<typeof inputGetUsuarios>;
type OrderByType = z.infer<typeof inputGetUsuarios>["orderBy"];
type PageSizeType = z.infer<typeof inputGetUsuarios>["pageSize"];

const createQueryString = (filters: AdminUsuariosFilters) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

const changeSorting = (filters: AdminUsuariosFilters, newSorting: SortingState): AdminUsuariosFilters => {
  const newFilters: AdminUsuariosFilters = {
    ...filters,
    orderBy: newSorting[0]?.id as OrderByType,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
    pageIndex: "0",
  };

  const filtersTyped = inputGetUsuarios.parse(newFilters);

  return filtersTyped;
};

const changePagination = (filters: AdminUsuariosFilters, newPagination: PaginationState): AdminUsuariosFilters => {
  const newFilters: AdminUsuariosFilters = {
    ...filters,
    pageIndex: newPagination.pageIndex.toString(),
    pageSize: newPagination.pageSize.toString() as PageSizeType,
  };

  const filtersTyped = inputGetUsuarios.parse(newFilters);

  return filtersTyped;
};

const changeSearchText = (filters: AdminUsuariosFilters, searchText: string): AdminUsuariosFilters => {
  const newFilters: AdminUsuariosFilters = {
    ...filters,
    searchText,
    pageIndex: "0",
  };

  const filtersTyped = inputGetUsuarios.parse(newFilters);

  return filtersTyped;
};

const changeRol = (filters: AdminUsuariosFilters, rol: string): AdminUsuariosFilters => {
  const newFilters: AdminUsuariosFilters = {
    ...filters,
    rol,
  };

  const filtersTyped = inputGetUsuarios.parse(newFilters);

  return filtersTyped;
};

const getPagination = (filters: AdminUsuariosFilters): { pageSize: number; pageIndex: number } => {
  const { pageIndex, pageSize } = filters;

  return { pageIndex: parseInt(pageIndex), pageSize: parseInt(pageSize) };
};

const getSorting = (filters: AdminUsuariosFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const useAdminUsuariosQueryParam = (filters: AdminUsuariosFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const sorting = getSorting(filters);
  const pagination = getPagination(filters);
  const searchText = filters.searchText;
  const rol = filters.rol;

  const changeQueryParams = useCallback(
    (filters: AdminUsuariosFilters) => {
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

  const onRolChange = useCallback(
    (rol: string) => {
      const newFilters = changeRol(filters, rol);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  return {
    refresh: () => router.refresh(),
    sorting,
    pagination,
    searchText,
    rol,
    onSortingChange,
    onSearchTextChange,
    onPaginationChange,
    onRolChange,
  };
};
