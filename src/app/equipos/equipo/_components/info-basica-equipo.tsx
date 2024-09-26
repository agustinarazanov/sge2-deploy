import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import Image from "next/image";

export const EquipoInformacionBasica = ({ equipoId }: { equipoId: number }) => {
  const { data: equipo, isLoading, isError } = api.equipos.equipoPorId.useQuery({ id: equipoId });

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  return (
    <>
      <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">Descripción:</div>
      <div className="flex w-full flex-col space-x-0 px-12 md:flex-row md:space-x-4">
        <div className="flex w-full flex-col border lg:flex-col lg:justify-between">
          <div className="mt-4">
            <Image
              src={equipo?.tipo.imagen ?? ""}
              alt="Imagen del tipo"
              className="h-auto w-fit"
              height={100}
              width={100}
            />
          </div>
        </div>
        <div className="flex w-full flex-col space-y-4 pt-2">
          <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
            <div className="w-full">
              <u>Tipo:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.tipo.nombre}`}
            </div>
          </div>

          <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
            <div className="w-full">
              <u>Inventario:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.inventarioId}`}
            </div>
          </div>

          <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
            <div className="w-full">
              <u>Marca:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.marca.nombre}`}
            </div>
          </div>

          <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
            <div className="w-full">
              <u>Modelo:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.modelo}`}
            </div>
          </div>

          <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
            <div className="w-full">
              <u>Palabras clave:</u>{" "}
              {isLoading ? <Skeleton className="h-4 w-full" /> : `${equipo?.palabrasClave ?? ""}`}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
