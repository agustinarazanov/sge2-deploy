import DetalleUsuario from "./detalle-usuario";
import DetalleReserva from "./detalle-reserva";
import { type RouterOutputs } from "@/trpc/react";
import { Suspense } from "react";

type UsuarioData = RouterOutputs["admin"]["usuarios"]["getUsuarioPorId"];
type DetalleContenedor = {
  usuarioData: UsuarioData;
};

function ContenedorUsuario({ usuarioData }: DetalleContenedor) {
  if (!usuarioData) {
    return <div className="text-center text-red-500">Usuario no encontrado</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <DetalleUsuario usuarioData={usuarioData} />
      </div>

      <div className="space-y-8">
        <Suspense key={usuarioData?.id} fallback={<div>Cargando reservas de laboratorio...</div>}>
          <DetalleReserva
            idUsuario={usuarioData?.id}
            titulo="Reserva de Laboratorio"
            descripcion="Historial de Laboratorios"
          />
        </Suspense>
        <Suspense fallback={<div>Cargando reservas de inventario...</div>}>
          <DetalleReserva
            idUsuario={usuarioData?.id}
            titulo="Reserva de Inventario"
            descripcion="Historial de Inventarios"
          />
        </Suspense>
        <Suspense fallback={<div>Cargando reservas de libros...</div>}>
          <DetalleReserva idUsuario={usuarioData?.id} titulo="Reserva de Libros" descripcion="Historial de Libros" />
        </Suspense>
      </div>
    </div>
  );
}

export default ContenedorUsuario;
