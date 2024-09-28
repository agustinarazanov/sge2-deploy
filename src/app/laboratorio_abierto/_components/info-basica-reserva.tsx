import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, BookOpenIcon, MapPinIcon } from "lucide-react";
import { Label } from "@/components/ui";
import { api } from "@/trpc/react";
import { BadgeEstatusReserva } from "@/app/_components/badge-estatus-reserva";

type ReservaDetalleProps = {
  reservaId: number;
};

export const ReservaDetalle = ({ reservaId }: ReservaDetalleProps) => {
  const {
    data: reserva,
    isLoading,
    isError,
  } = api.reservas.reservaLaboratorioAbierto.getReservaPorID.useQuery({
    id: reservaId,
  });

  if (isError) {
    return <div>Error al cargar reserva...</div>;
  }

  if (isLoading) {
    return <div>Cargando reserva...</div>;
  }

  if (!reserva) {
    return <div>Reserva no encontrada</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex-grow text-center sm:text-left">
            <CardTitle className="mb-1 text-2xl">Reserva #{reserva.numeroReserva}</CardTitle>
            <p className="mb-1">{reserva.especialidad}</p>
            <p className="mb-2 text-sm">{reserva.descripcion}</p>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <BadgeEstatusReserva estatus={reserva.reserva.estatus} />
              <Badge color="secondary">{reserva.reserva.tipo}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Fecha de Inicio
            </Label>
            <p>{new Date(reserva.reserva.fechaHoraInicio ?? "").toLocaleDateString()}</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <ClockIcon className="mr-2 h-4 w-4" />
              Hora de Inicio
            </Label>
            <p>{new Date(reserva.reserva.fechaHoraInicio ?? "").toLocaleTimeString()}</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Fecha de Fin
            </Label>
            <p>{new Date(reserva.reserva.fechaHoraFin ?? "").toLocaleDateString()}</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <ClockIcon className="mr-2 h-4 w-4" />
              Hora de Fin
            </Label>
            <p>{new Date(reserva.reserva.fechaHoraFin ?? "").toLocaleTimeString()}</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <BookOpenIcon className="mr-2 h-4 w-4" />
              Mail Confirmado
            </Label>
            <p>{reserva.mailConfirmado ? "Sí" : "No"}</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <MapPinIcon className="mr-2 h-4 w-4" />
              Laboratorio Actual
            </Label>
            <p>{reserva.laboratorio.nombre}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
