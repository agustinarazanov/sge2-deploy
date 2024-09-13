import { api } from "@/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Libro</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservas.map((reserva) => (
              <TableRow key={reserva.id}>
                <TableCell className="font-medium">{reserva.id}</TableCell>
                <TableCell>{reserva.fechaCreacion.toLocaleDateString("es-ES")}</TableCell>
                <TableCell>{reserva.libro.titulo}</TableCell>
                <TableCell className="text-right">
                  <Badge color={reserva.reserva.estatus === "PENDIENTE" ? "danger" : "success"}>
                    {reserva.reserva.estatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default DetalleReserva;
