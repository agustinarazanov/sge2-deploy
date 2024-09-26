import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

export const EquipoInformacionUbicacion = ({ equipoId }: { equipoId: number }) => {
  const { data: equipo, isLoading, isError } = api.equipos.equipoPorId.useQuery({ id: equipoId });

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  return (
    <>
      <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">Ubicación:</div>
      <div className="flex w-full flex-col px-12 md:flex-row">
        <div className="flex w-full flex-col gap-x-4 space-y-4 md:flex-row md:space-y-0 lg:justify-between">
          <div className="basis-1/4">
            <u>Sede:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.sede.nombre}`}
          </div>

          <div className="basis-1/4">
            <u>Laboratorio:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.laboratorio.nombre}`}
          </div>

          <div className="basis-1/4">
            <u>Armario:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.armario?.nombre ?? ""}`}
          </div>

          <div className="basis-1/4">
            <u>Estante:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.estante?.nombre ?? ""}`}
          </div>
        </div>
      </div>
    </>
  );
};
