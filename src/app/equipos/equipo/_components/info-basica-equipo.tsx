import { Skeleton } from "@/components/ui/skeleton";
import { getRutaImagen } from "@/shared/imagen";
import { api } from "@/trpc/react";
import Image from "next/image";

export const EquipoInformacionBasica = ({ equipoId }: { equipoId: number }) => {
  const { data: equipo, isLoading, isError } = api.equipos.equipoPorId.useQuery({ id: equipoId });

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const equipoImagen = getRutaImagen(equipo?.tipo.imagen ?? "");

  return (
    <>
      <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">Descripción:</div>
      <div className="flex w-full flex-row space-x-0 px-12 sm:flex-row sm:space-x-4 md:flex-col lg:flex-row">
        <div className="flex w-full flex-col lg:flex-col lg:justify-between">
          <div className="mt-4">
            <div style={{ position: "relative", width: "200px", height: "200px" }}>
              <Image
                src={equipoImagen}
                alt={`Equipo ${equipo?.tipo.nombre}`}
                className="rounded-xl"
                sizes="200px"
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
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
