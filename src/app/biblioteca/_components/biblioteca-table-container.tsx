import { api } from "@/trpc/server";
import { BibliotecaTable } from "./table";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { inputGetBooks } from "@/shared/biblioteca-filter.schema";

type BibliotecaTableContainerProps = {
  searchParams: ReadonlyURLSearchParams;
};

export default async function BibliotecaTableContainer({ searchParams }: BibliotecaTableContainerProps) {
  const filter = inputGetBooks.parse(searchParams);

  const libros = await api.biblioteca.getAll({ ...filter });

  return (
    <>
      <BibliotecaTable libros={libros} filters={filter} />
    </>
  );
}
