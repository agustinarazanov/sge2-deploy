import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { useCallback } from "react";
import { inputGetLaboratorios } from "@/shared/filters/admin-laboratorios-filter.schema";

type AdminLaboratoriosFilters = z.infer<typeof inputGetLaboratorios>;

const createQueryString = (filters: AdminLaboratoriosFilters) => {
  // TODO @Alex: Validate that sedeId is a number
  const params = new URLSearchParams({ searchText: filters.searchText, sedeId: String(filters.sedeId) });

  return params.toString();
};

const changeSearchText = (filters: AdminLaboratoriosFilters, searchText: string): AdminLaboratoriosFilters => {
  const newFilters: AdminLaboratoriosFilters = {
    ...filters,
    searchText,
  };

  const filtersTyped = inputGetLaboratorios.parse(newFilters);

  return filtersTyped;
};

export const useAdminLaboratoriosQueryParam = (filters: AdminLaboratoriosFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const searchText = filters.searchText;

  const changeQueryParams = useCallback(
    (filters: AdminLaboratoriosFilters) => {
      router.push(pathname + "?" + createQueryString(filters));
    },
    [pathname, router],
  );

  const onSearchTextChange = useCallback(
    (searchText: string) => {
      const newFilters = changeSearchText(filters, searchText);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  return {
    refresh: () => router.refresh(),
    searchText,
    onSearchTextChange,
  };
};
