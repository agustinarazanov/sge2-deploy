import { api } from "@/trpc/server";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui";
import cn from "classnames";
import { Badge } from "@/components/ui/badge";

type ReservaData = {
  idUsuario: string;
  titulo: string;
  descripcion: string;
};

async function DetalleReserva({ idUsuario, titulo, descripcion }: ReservaData) {
  var reservas = await api.reservas.reservaBiblioteca.getReservaPorUser({ id: idUsuario });
  // mock reservas to test the component
  reservas = [
    {
      id: 1,
      fechaCreacion: new Date(),
      fechaEntregado: new Date(),
      reservaId: 1,
      libroId: 1,
      usuarioCreadorId: "idUsuario",
      usuarioModificadorId: "",
      fechaModificacion: new Date(),
      libro: {
        id: 1,
        bibliotecaId: "1",
        inventarioId: "1",
        titulo: "Libro 1",
        anio: 2022,
        autorId: 1,
        editorialId: 1,
        isbn: "ISBN 1",
        sedeId: 1,
        laboratorioId: 1,
        idiomaId: 1,
        armarioId: 0,
        estanteId: 0,
        fechaCreacion: new Date(),
        fechaModificacion: new Date(),
        usuarioCreadorId: "",
        usuarioModificadorId: "",
      },
      reserva: {
        id: 1,
        usuarioCreadorId: idUsuario,
        fechaCreacion: new Date(),
        tipo: "LIBRO",
        estatus: "PENDIENTE",
        fechaHoraInicio: new Date(),
        fechaHoraFin: new Date(),
        codigo: "",
        usuarioModificadorId: "",
        disponible: true,
        usuarioTutorId: "",
        fechaModificacion: new Date(),
        fechaAprobacion: new Date(),
      },
    },
    {
      id: 2,
      fechaCreacion: new Date(),
      fechaEntregado: new Date(),
      reservaId: 2,
      libroId: 2,
      usuarioCreadorId: "idUsuario",
      usuarioModificadorId: "",
      fechaModificacion: new Date(),
      libro: {
        id: 2,
        bibliotecaId: "2",
        inventarioId: "2",
        titulo: "Libro 2asdasd",
        disponible: true,
        anio: 2022,
        autorId: 2,
        editorialId: 2,
        isbn: "ISBN 2",
        sedeId: 2,
        laboratorioId: 2,
        idiomaId: 2,
        armarioId: 0,
        estanteId: 0,
        fechaCreacion: new Date(),
        fechaModificacion: new Date(),
        usuarioCreadorId: "",
        usuarioModificadorId: "",
      },
      reserva: {
        id: 2,
        usuarioCreadorId: idUsuario,
        fechaCreacion: new Date(),
        tipo: "LIBRO",
        estatus: "PENDIENTE",
        fechaHoraInicio: new Date(),
        fechaHoraFin: new Date(),
        codigo: "",
        usuarioModificadorId: "",
        usuarioTutorId: "",
        fechaModificacion: new Date(),
        fechaAprobacion: new Date(),
      },
    },
  ];

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Card className={cn("w-full max-w-4xl text-center hover:border-primary/50")}>
        <CardHeader>
          <CardTitle className="py-4">Historial de Reservas</CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y">
            <thead>
              <tr>
                <th className="w-1/12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="w-2/12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha</th>
                <th className="w-6/12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Libro</th>
                <th className="w-3/12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td className="px-6 py-4 text-sm font-medium">{reserva.id}</td>
                  <td className="px-6 py-4 text-sm">{reserva.fechaCreacion.toLocaleDateString("es-ES")}</td>
                  <td className="px-6 py-4 text-sm">{reserva.libro.titulo}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge color={reserva.reserva.estatus === "PENDIENTE" ? "warning" : "success"}>
                      {reserva.reserva.estatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default DetalleReserva;
