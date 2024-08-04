import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { type SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { inputGetRoles } from "@/shared/filters/admin-roles-filter.schema";

type AdminRolesFilters = z.infer<typeof inputGetRoles>;
type OrderByType = z.infer<typeof inputGetRoles>["orderBy"];

const createQueryString = (filters: AdminRolesFilters) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

const changeSorting = (filters: AdminRolesFilters, newSorting: SortingState): AdminRolesFilters => {
  const newFilters: AdminRolesFilters = {
    ...filters,
    orderBy: newSorting[0]?.id as OrderByType,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
  };

  const filtersTyped = inputGetRoles.parse(newFilters);

  return filtersTyped;
};

const changeSearchText = (filters: AdminRolesFilters, searchText: string): AdminRolesFilters => {
  const newFilters: AdminRolesFilters = {
    ...filters,
    searchText,
  };

  const filtersTyped = inputGetRoles.parse(newFilters);

  return filtersTyped;
};

const changePermiso = (filters: AdminRolesFilters, permiso: string): AdminRolesFilters => {
  const newFilters: AdminRolesFilters = {
    ...filters,
    permiso,
  };

  const filtersTyped = inputGetRoles.parse(newFilters);

  return filtersTyped;
};

const getSorting = (filters: AdminRolesFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const useAdminRolesQueryParam = (filters: AdminRolesFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const sorting = getSorting(filters);
  const searchText = filters.searchText;
  const permiso = filters.permiso;

  const changeQueryParams = useCallback(
    (filters: AdminRolesFilters) => {
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

  const onSearchTextChange = useCallback(
    (searchText: string) => {
      const newFilters = changeSearchText(filters, searchText);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  const onPermisoChange = useCallback(
    (permiso: string) => {
      const newFilters = changePermiso(filters, permiso);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  return {
    refresh: () => router.refresh(),
    sorting,
    searchText,
    permiso,
    onSortingChange,
    onSearchTextChange,
    onPermisoChange,
  };
};
