import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, BookOpenIcon, MapPinIcon } from "lucide-react";
import { Label } from "@/components/ui";

interface ReservaDetalleProps {
  reserva: any;
  laboratorios: Array<{ id: number; nombre: string }>;
}

export const ReservaDetalle: React.FC<ReservaDetalleProps> = ({ reserva, laboratorios }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-yellow-500 text-yellow-900";
      case "FINALIZADA":
        return "bg-green-500 text-green-900";
      case "CANCELADA":
        return "bg-red-500 text-red-900";
      default:
        return "bg-gray-500 text-gray-900";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex-grow text-center sm:text-left">
            <CardTitle className="mb-1 text-2xl">Reserva #{reserva.numeroReserva}</CardTitle>
            <p className="mb-1">{reserva.especialidad}</p>
            <p className="mb-2 text-sm">{reserva.descripcion}</p>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge className={getStatusColor(reserva.reserva.estatus)}>{reserva.reserva.estatus}</Badge>
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
            <p>{new Date(reserva.reserva.fechaHoraInicio).toLocaleDateString()}</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <ClockIcon className="mr-2 h-4 w-4" />
              Hora de Inicio
            </Label>
            <p>{new Date(reserva.reserva.fechaHoraInicio).toLocaleTimeString()}</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Fecha de Fin
            </Label>
            <p>{new Date(reserva.reserva.fechaHoraFin).toLocaleDateString()}</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center font-semibold">
              <ClockIcon className="mr-2 h-4 w-4" />
              Hora de Fin
            </Label>
            <p>{new Date(reserva.reserva.fechaHoraFin).toLocaleTimeString()}</p>
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
            <p>{laboratorios.find((lab) => lab.id === reserva.laboratorioId)?.nombre}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
