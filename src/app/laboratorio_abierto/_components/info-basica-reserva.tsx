import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";

export const LaboratorioAbiertoReservaInformacionBasica = ({ reservaID }: { reservaID: number }) => {
  const {
    data: reserva,
    isLoading,
    isError,
  } = api.reservas.reservaLaboratorioAbierto.getReservaPorID.useQuery({ id: reservaID });

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  return (
    <>
      <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">Descripción:</div>
      <div className="flex w-full flex-col space-y-4 px-12">
        <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
          <div className="w-full">
            <u>Laboratorio:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${reserva?.laboratorio?.nombre}`}
          </div>
        </div>

        <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
          <div className="basis-1/3">
            <u>ID:</u> {isLoading ? <Skeleton className="h-4 w-full" /> : `${reserva?.id}`}
          </div>
        </div>
      </div>
    </>
  );
};
