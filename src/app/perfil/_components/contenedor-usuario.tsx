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
    return <div>Usuario no encontrado</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <DetalleUsuario usuarioData={usuarioData} />

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Suspense key={usuarioData?.id} fallback={<div>Cargando...</div>}>
          <DetalleReserva idUsuario={usuarioData?.id} titulo="Reserva de Laboratorio" descripcion="{.titulo}" />
        </Suspense>
        <DetalleReserva idUsuario={usuarioData?.id} titulo="Reserva de Inventario" descripcion="{.titulo}" />
        <DetalleReserva idUsuario={usuarioData?.id} titulo="Reserva de Libros" descripcion="{.titulo}" />
      </div>
    </div>
  );
}

export default ContenedorUsuario;
