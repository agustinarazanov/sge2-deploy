import { type RouterOutputs } from "@/trpc/react";
import DetalleUsuario from "./detalle-usuario";
import ClienteContenedorUsuario from "./cliente-contenedor-usuario";

type UsuarioData = RouterOutputs["admin"]["usuarios"]["getUsuarioPorId"];
type DetalleContenedor = {
  usuarioData: UsuarioData;
};

export default function ContenedorUsuario({ usuarioData }: DetalleContenedor) {
  return (
    <div className="container mx-auto space-y-8 p-4">
      <DetalleUsuario usuarioData={usuarioData} />
      <ClienteContenedorUsuario usuarioData={usuarioData} />
    </div>
  );
}
