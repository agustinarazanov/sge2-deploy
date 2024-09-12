import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import Image from "next/image";
import ContenedorUsuario from "@/app/perfil/_components/contenedor-usuario";
import {api} from "@/trpc/server";
type PageProps = {
    params: { id?: string };
};

export default async function Home({ params: { id } }: PageProps) {
    if (id === undefined) {
        return <div>Usuario no encontrado</div>;
    }

    const usuario = await api.admin.usuarios.getUsuarioPorId({ id: id });
    //TODO get usuario por id para ver y traer las reservas.

    return (
        <ContenedorUsuario usuarioData={usuario} />
    );
}
