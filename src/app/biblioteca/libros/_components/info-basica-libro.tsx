import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

export const LibroInformacionBasica = ({ libroId }: { libroId: number }) => {
  const { data: libro, isLoading, isError } = api.biblioteca.libroPorId.useQuery({ libroId });

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  return (
    <>
      <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">Descripción:</div>
      <div className="flex w-full flex-col space-y-4 px-12">
        <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
          <div className="w-full">
            <u>Título:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.titulo}`}
          </div>
        </div>

        <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
          <div className="w-full">
            <u>Autor:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.autor.autorNombre}`}
          </div>
        </div>

        <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
          <div className="basis-1/3">
            <u>ID:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.id}`}
          </div>
          <div className="basis-1/3">
            <u>Inventario ID:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.inventarioId}`}
          </div>
          <div className="basis-1/3">
            <u>Biblioteca ID:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.bibliotecaId}`}
          </div>
        </div>

        <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
          <div className="w-full">
            <u>ISBN:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.isbn}`}
          </div>

          <div className="w-full">
            <u>Año:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.anio}`}
          </div>
        </div>

        <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
          <div className="w-full">
            <u>Editorial:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.editorial.editorial}`}
          </div>

          <div className="w-full">
            <u>Idioma:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.idioma.idioma}`}
          </div>
        </div>

        <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
          <div className="w-full">
            <u>Materias:</u> {libro?.materias.map((materia) => materia.materia.nombre).join(", ")}
          </div>
        </div>
      </div>
    </>
  );
};
