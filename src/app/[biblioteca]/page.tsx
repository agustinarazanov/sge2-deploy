"use client";

import { api } from "@/trpc/react";

import { BibliotecaButtonOrderBy, bibliotecaFilterAtom } from "./(components)/biblioteca-filter";
import { useAtomValue } from "@zedux/react";
import { BibliotecaNewLibro } from "./(components)/biblioteca-new-book";

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

  const handleNewLibro = async () => {
    await utils.biblioteca.getAll.invalidate();
  };

  return (
    <>
      <h3 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Biblioteca</h3>

      <div className="relative flex w-full flex-row items-center justify-end space-x-1.5">
        <BibliotecaButtonOrderBy />

        <BibliotecaNewLibro onSubmit={handleNewLibro} />
      </div>

      <table className="table- table-auto">
        <caption className="caption-top">Lista de todos los libros en la biblioteca</caption>
        <thead>
          <tr>
            <th>Inventario</th>
            <th>ID Biblioteca</th>
            <th>Titulo</th>
            <th>Autor</th>
            <th>Año</th>
            <th>Editorial</th>
            <th>Idioma</th>
            <th>ISBN</th>
            <th>Materias</th>
            <th>Estado Prestamo</th>
          </tr>
        </thead>
        <tbody>
          {(libros ?? []).map((libro) => {
            return (
              <tr key={libro.id} className="hover:bg-gray-700">
                <td> {libro.inventario} </td>
                <td> {libro.bibliotecaId} </td>
                <td> {libro.titulo} </td>
                <td> {libro.autor} </td>
                <td> {libro.anio} </td>
                <td> {libro.editorial} </td>
                <td> {libro.idioma} </td>
                <td> {libro.isbn} </td>
                <td> TODO </td>
                <td>
                  {libro.estado === "prestado" ? (
                    <span className="text-red-600">Prestado</span>
                  ) : (
                    <span className="text-green-600">Disponible</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
