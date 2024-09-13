import { api } from "@/trpc/server";

type ReservaData = {
  idUsuario: string;
  titulo: string;
  descripcion: string;
};

async function DetalleReserva({ idUsuario, titulo, descripcion }: ReservaData) {
  const reservas = await api.reservas.reservaBiblioteca.getReservaPorUser({ id: idUsuario });

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h3 className="mb-4 text-xl font-semibold">{titulo}</h3>
      <p className="text-xl">{descripcion}</p>
      {reservas.map((reserva) => {
        return (
          <p key={reserva.id}>
            {reserva.id} - {reserva.id}
          </p>
        );
      })}
    </div>
  );
}

export default DetalleReserva;
