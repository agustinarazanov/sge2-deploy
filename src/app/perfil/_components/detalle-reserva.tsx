import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ReservaBase = {
  id: number;
  fechaCreacion: Date;
  estatus: string;
};

type ColumnConfig<T> = {
  header: string;
  key: keyof T | ((item: T) => React.ReactNode);
  className?: string;
};

type DetalleReservaProps<T extends ReservaBase> = {
  idUsuario: string;
  titulo: string;
  descripcion: string;
  reservas: T[];
  columns: ColumnConfig<T>[];
};

function DetalleReserva<T extends ReservaBase>({ titulo, reservas, columns }: DetalleReservaProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservas.map((reserva) => (
              <TableRow key={reserva.id}>
                {columns.map((column, index) => (
                  <TableCell key={index} className={column.className}>
                    {typeof column.key === "function" ? column.key(reserva) : (reserva[column.key] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default DetalleReserva;
