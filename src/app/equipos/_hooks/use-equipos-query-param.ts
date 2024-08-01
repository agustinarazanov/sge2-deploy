import { usePathname, useRouter } from "next/navigation";
import { type z } from "zod";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { inputGetEquipos } from "@/shared/equipos-filter.schema";

type EquiposFilters = z.infer<typeof inputGetEquipos>;
type OrderByType = z.infer<typeof inputGetEquipos>["orderBy"];
type PageSizeType = z.infer<typeof inputGetEquipos>["pageSize"];

const createQueryString = (filters: EquiposFilters) => {
  const params = new URLSearchParams(filters);

  return params.toString();
};

const changeSorting = (filters: EquiposFilters, newSorting: SortingState): EquiposFilters => {
  const newFilters: EquiposFilters = {
    ...filters,
    orderBy: newSorting[0]?.id as OrderByType,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
    pageIndex: "0",
  };

  const filtersTyped = inputGetEquipos.parse(newFilters);

  return filtersTyped;
};

const changePagination = (filters: EquiposFilters, newPagination: PaginationState): EquiposFilters => {
  const newFilters: EquiposFilters = {
    ...filters,
    pageIndex: newPagination.pageIndex.toString(),
    pageSize: newPagination.pageSize.toString() as PageSizeType,
  };

  const filtersTyped = inputGetEquipos.parse(newFilters);

  return filtersTyped;
};

const changeSearchText = (filters: EquiposFilters, searchText: string): EquiposFilters => {
  const newFilters: EquiposFilters = {
    ...filters,
    searchText,
    pageIndex: "0",
  };

  const filtersTyped = inputGetEquipos.parse(newFilters);

  return filtersTyped;
};

const changeLaboratorio = (filters: EquiposFilters, laboratorio: string): EquiposFilters => {
  const newFilters: EquiposFilters = {
    ...filters,
    laboratorio,
    pageIndex: "0",
  };

  const filtersTyped = inputGetEquipos.parse(newFilters);

  return filtersTyped;
};

const changeArmario = (filters: EquiposFilters, armario: string): EquiposFilters => {
  const newFilters: EquiposFilters = {
    ...filters,
    armario,
    pageIndex: "0",
  };

  const filtersTyped = inputGetEquipos.parse(newFilters);

  return filtersTyped;
};

const changeTipo = (filters: EquiposFilters, tipo: string): EquiposFilters => {
  const newFilters: EquiposFilters = {
    ...filters,
    tipo,
    pageIndex: "0",
  };

  const filtersTyped = inputGetEquipos.parse(newFilters);

  return filtersTyped;
};

const getPagination = (filters: EquiposFilters): { pageSize: number; pageIndex: number } => {
  const { pageIndex, pageSize } = filters;

  return { pageIndex: parseInt(pageIndex), pageSize: parseInt(pageSize) };
};

const getSorting = (filters: EquiposFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const useEquiposQueryParam = (filters: EquiposFilters) => {
  const pathname = usePathname();
  const router = useRouter();

  const sorting = getSorting(filters);
  const pagination = getPagination(filters);
  const searchText = filters.searchText;
  const laboratorio = filters.laboratorio;
  const armario = filters.armario;
  const tipo = filters.tipo;

  const changeQueryParams = useCallback(
    (filters: EquiposFilters) => {
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

  const onLaboratorioChange = useCallback(
    (materia: string) => {
      const newFilters = changeLaboratorio(filters, materia);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  const onArmarioChange = useCallback(
    (materia: string) => {
      const newFilters = changeArmario(filters, materia);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  const onTipoChange = useCallback(
    (materia: string) => {
      const newFilters = changeTipo(filters, materia);

      changeQueryParams({ ...newFilters });
    },
    [filters, changeQueryParams],
  );

  return {
    refresh: () => router.refresh(),
    pagination,
    sorting,
    searchText,
    laboratorio,
    armario,
    tipo,
    onSortingChange,
    onPaginationChange,
    onSearchTextChange,
    onLaboratorioChange,
    onArmarioChange,
    onTipoChange,
  };
};
