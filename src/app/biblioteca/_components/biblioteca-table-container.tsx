import { api } from "@/trpc/server";
import { BibliotecaTable } from "./table";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { getQueryParamFilters } from "../_queryParams";

type BibliotecaTableContainerProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function BibliotecaTableContainer({ searchParams }: BibliotecaTableContainerProps) {
  const filter = getQueryParamFilters(searchParams);

  const libros = await api.biblioteca.getAll({ ...filter });

  return (
    <>
      <div>
        <p>{JSON.stringify(filter)}</p>
      </div>

      <BibliotecaTable libros={libros} filters={filter} />
    </>
  );
}
