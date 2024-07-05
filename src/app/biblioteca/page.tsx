"use client";

import { api } from "@/trpc/react";

import { BibliotecaButtonOrderBy, bibliotecaFilterAtom } from "./(components)/biblioteca-filter";
import { useAtomValue } from "@zedux/react";
import { BibliotecaNewLibro } from "./(components)/biblioteca-new-book";
import { DataTable } from "@/components/ui";
import RemoveLibroModal from "./table/remove-libro";
import { getColumns as getBibliotecaColumns } from "./table/columns";

export default function Biblioteca() {
  const filterData = useAtomValue(bibliotecaFilterAtom);

  const utils = api.useUtils();
  const { data: libros, isError, isLoading } = api.biblioteca.getAll.useQuery({ filter: { ...filterData.filter } }, {});

  if (isError) {
    return <div>Error cargando libros</div>;
  }

  if (isLoading) {
    return <div>Cargando libros...</div>;
  }

  const handleCambioEnBiblioteca = async () => {
    await utils.biblioteca.getAll.invalidate();
  };

  const columns = getBibliotecaColumns();

  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Biblioteca</h3>

      <div className="relative flex w-full flex-row items-center justify-end space-x-1.5">
        <BibliotecaButtonOrderBy />

        <BibliotecaNewLibro onSubmit={handleCambioEnBiblioteca} />
      </div>

      <DataTable
        data={libros ?? []}
        columns={columns}
        paginationConfig={{ pageSize: true, selectedRows: false }}
        action={{
          cell({ original }) {
            return (
              <RemoveLibroModal libroId={original.id} nombre={original.titulo} onSubmit={handleCambioEnBiblioteca} />
            );
          },
        }}
      />
    </>
  );
}
