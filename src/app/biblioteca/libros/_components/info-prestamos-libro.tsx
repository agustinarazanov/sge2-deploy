import { Skeleton } from "@/components/ui/skeleton";
import { getDateISOString } from "@/shared/get-date";
import { api, type RouterOutputs } from "@/trpc/react";
import Image from "next/image";

type Props = {
  libroId: number;
};

type ReservaLibro = RouterOutputs["reservas"]["reservaBiblioteca"]["verReservas"][number];
type UsuarioReserva =
  | ReservaLibro["usuarioAprobador"]
  | ReservaLibro["usuarioSolicito"]
  | ReservaLibro["usuarioRecibio"];

export const LibroInformacionPrestamos = (props: Props) => {
  const {
    data: reservas,
    isLoading,
    isError,
  } = api.reservas.reservaBiblioteca.verReservas.useQuery({ libroId: props.libroId });

  if (isError) {
    return <div>Error al cargar reservas...</div>;
  }

  return (
    <>
      <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">Historial de Prestamos:</div>
      <div className="flex w-full flex-col space-y-4 px-12">
        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr>
              <th>Prestamo #</th>
              <th>Prestado a</th>
              <th>Fecha del prestamo</th>
              <th>Fecha de finalización</th>
              <th>Prestó</th>
              <th>Renovado</th>
              <th>Recibió</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7}>
                  <Skeleton className="h-4 w-full" />
                </td>
              </tr>
            ) : (
              reservas?.map((reserva) => <ReservaDeLibro key={reserva.id} reserva={reserva} />)
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

const ReservaDeLibro = ({ reserva }: { reserva: ReservaLibro }) => {
  return (
    <tr>
      <td>{reserva.id}</td>
      <td>
        <DatoUsuarioReserva usuario={reserva.usuarioSolicito} />
      </td>
      <td>{getDateISOString(reserva.fechaHoraInicio)}</td>
      <td>{getDateISOString(reserva.fechaHoraFin)}</td>
      <td>
        <DatoUsuarioReserva usuario={reserva.usuarioAprobador} />
      </td>
      <td>{reserva.estatus}</td>
      <td>
        {!reserva.usuarioRecibio ? (
          "No recibido"
        ) : (
          <>
            <DatoUsuarioReserva usuario={reserva.usuarioRecibio} />
            {reserva.fechaRecibido ? getDateISOString(reserva.fechaRecibido) : null}
          </>
        )}
      </td>
    </tr>
  );
};

const DatoUsuarioReserva = ({ usuario }: { usuario: UsuarioReserva }) => {
  if (!usuario) {
    return <span className="text-center">Sin información</span>;
  }

  const { nombre, name, apellido, legajo, email, image } = usuario;

  const firstName = nombre ?? name ?? "";
  const lastName = apellido ?? "";
  const fullName = `${firstName}, ${lastName}`;

  return (
    <div title={`${fullName} - ${email}`} className="flex flex-row content-center items-center space-x-2 text-center">
      <Image src={image ?? ""} alt="Imagen de perfil" width={32} height={32} className="rounded-full" />
      <span className="ml-2">{fullName}</span>
      <span className="ml-2">{legajo}</span>
    </div>
  );
};
