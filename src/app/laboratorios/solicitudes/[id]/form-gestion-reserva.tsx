import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";
import { esFechaPasada } from "@/shared/get-date";
import { ReservaDetalle } from "../../_components/info-basica-reserva";
import { ReservaAprobacion } from "../../_components/reserva-gestion";
import { ReservaEstatus } from "@prisma/client";

interface ReservaViewAdminProps {
  reservaId: number;
  onAprobar: () => void;
  onRechazar: () => void;
  onCancel: () => void;
}

export const ReservaViewAdmin = ({ reservaId, onCancel, onAprobar, onRechazar }: ReservaViewAdminProps) => {
  const { data: reservaData } = api.reservas.reservarLaboratorioCerrado.getReservaPorID.useQuery({
    id: Number(reservaId),
  });

  const esReservaPasada = esFechaPasada(reservaData?.reserva?.fechaHoraInicio);

  const estaCancelada = reservaData?.reserva.estatus === ReservaEstatus.CANCELADA;

  return (
    <ScrollArea className="max-h-[calc(100vh_-_10%)]">
      <div className="container mx-auto space-y-8 p-4">
        <ReservaDetalle reservaId={reservaId} mostrarCompleto={true} />
        {!esReservaPasada && !estaCancelada && (
          <ReservaAprobacion reservaId={reservaId} onCancel={onCancel} onAprobar={onAprobar} onRechazar={onRechazar} />
        )}
      </div>
    </ScrollArea>
  );
};
