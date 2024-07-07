import { inputGetBooks } from "@/shared/biblioteca-filter.schema";
import { type SortingState } from "@tanstack/react-table";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { type z } from "zod";

type BibliotecaFilters = z.infer<typeof inputGetBooks>;

export const getQueryParamFilters = (searchParams: ReadonlyURLSearchParams): BibliotecaFilters => {
  const filtersTyped = inputGetBooks.parse(searchParams);

  return filtersTyped;
};

export const getSorting = (filters: BibliotecaFilters): SortingState => {
  const { orderBy, orderDirection } = filters;

  return [{ id: orderBy, desc: orderDirection === "desc" }];
};

export const changeSorting = (filters: BibliotecaFilters, newSorting: SortingState): BibliotecaFilters => {
  const newFilters = {
    ...filters,
    orderBy: newSorting[0]?.id,
    orderDirection: newSorting[0]?.desc ? "desc" : "asc",
  };

  const filtersTyped = inputGetBooks.parse(newFilters);

  return filtersTyped;
};
