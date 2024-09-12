import {api} from "@/trpc/server";

type ReservaData = {
    idUsuario:string;
   titulo : string;
    descripcion: string;
};

async function DetalleReserva({ idUsuario, titulo, descripcion }: ReservaData) {
    const reservas = await api.reservas.reservaBiblioteca.getReservaPorUser(idUsuario);

    return (
    <div className="flex w-full flex-col items-center justify-center">
      <h3 className="text-xl font-semibold mb-4">{titulo}</h3>
      <p className="text-xl">{descripcion}</p>
        {reservas.map((reserva) => {
            return <p key = {reserva.id}>{reserva.id} - {reserva.id}</p>
        })}
    </div>
  );
}

export default DetalleReserva;
