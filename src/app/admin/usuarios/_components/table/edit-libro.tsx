import { ADMIN_ROUTE } from "@/shared/server-routes";
import { EditIcon } from "lucide-react";
import Link from "next/link";

type EditLibroModalProps = {
  usuarioId: string;
};

const rutaAdmin = ADMIN_ROUTE;

export const EditarUsuarioModal = (props: EditLibroModalProps) => {
  return (
    <Link key={props.usuarioId} href={`${rutaAdmin.href}/usuarios/${props.usuarioId}`} passHref prefetch={false}>
      <EditIcon />
    </Link>
  );
};
