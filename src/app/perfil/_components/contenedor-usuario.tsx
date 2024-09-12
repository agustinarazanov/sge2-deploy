import DetalleUsuario from './detalle-usuario';
import DetalleReserva from './detalle-reserva';
import {RouterOutputs} from "@/trpc/react";
import {Suspense} from "react";

type UsuarioData = RouterOutputs["admin"]["usuarios"]["getUsuarioPorId"];
type DetalleContenedor = {
    usuarioData: UsuarioData;
};


function ContenedorUsuario({ usuarioData }: DetalleContenedor) {
    return (
        <div className="container mx-auto p-8">
            <DetalleUsuario usuarioData={usuarioData}/>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <Suspense key={usuarioData?.id} fallback={<div>CARGANDO</div>}>
                    <DetalleReserva
                        idUsuario = {usuarioData?.id}
                        titulo="Reserva de Laboratorio"
                        descripcion="{.titulo}"
                    />
                </Suspense>
                <DetalleReserva
                    titulo="Reserva de Inventario"
                    descripcion="{.titulo}"
                />
                <DetalleReserva
                    titulo="Reserva de Libros"
                    descripcion="{.titulo}"
                />
            </div>
        </div>
    );
}

export default ContenedorUsuario;
