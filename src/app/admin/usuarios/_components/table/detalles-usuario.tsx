import {ViewIcon} from "lucide-react";
import Link from "next/link";

type EditLibroModalProps = {
  usuarioId: string;
};

export const DetallesUsuarioPage = (props: EditLibroModalProps) => {
  return (
    <Link key={props.usuarioId} href={`/perfil/${props.usuarioId}`} passHref prefetch={false}>
      <ViewIcon />
    </Link>
  );
};
