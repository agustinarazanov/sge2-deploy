import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

export const EquipoInformacionBasica = ({ equipoId }: { equipoId: number }) => {
  const { data: equipo, isLoading, isError } = api.equipos.equipoPorId.useQuery({ id: equipoId });

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  return (
    <>
      <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">Descripción:</div>
      <div className="flex w-full flex-col space-y-4 px-12">
        <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
        <div className="w-full">
            <u>Inventario:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `#${equipo?.inventarioId}`}
          </div>
        </div>

        <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
          <div className="w-full">
            <u>Tipo:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.tipo.nombre}`}
          </div>
        </div>

        <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">

          <div className="basis-1/3">
            <u>Numero de serie:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.numeroSerie}`}
          </div>
          <div className="basis-1/3">
            <u>Marca:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.marca.nombre}`}
          </div>
          <div className="basis-1/3">
            <u>Modelo:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.modelo}`}
          </div>
        </div>

        <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
          <div className="w-full">
            <u>Palabras clave:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.palabrasClave ?? ""}`}
          </div>

          <div className="w-full">
            <u>Estado:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.estado.nombre}`}
          </div>
        </div>
      </div>
    </>
  );
};
