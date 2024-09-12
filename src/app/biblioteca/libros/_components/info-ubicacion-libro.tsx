import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

export const LibroInformacionUbicacion = ({ libroId }: { libroId: number }) => {
  const { data: libro, isLoading, isError } = api.biblioteca.libroPorId.useQuery({ libroId });

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  return (
    <>
      <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">Ubicación:</div>
      <div className="flex w-full flex-col space-y-4 px-12">
        <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
          <div className="basis-1/4">
            <u>Sede:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.sede.nombre}`}
          </div>

          <div className="basis-1/4">
            <u>Laboratorio:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.laboratorio.nombre}`}
          </div>

          <div className="basis-1/4">
            <u>Armario:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.armario?.nombre ?? "Vacío"}`}
          </div>

          <div className="basis-1/4">
            <u>Estante:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${libro?.estante?.nombre ?? "Vacío"}`}
          </div>
        </div>
      </div>
    </>
  );
};
