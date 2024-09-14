import { EQUIPOS_ROUTE } from "@/shared/server-routes";
import { EditIcon } from "lucide-react";
import Link from "next/link";

type EditTipoModalProps = {
  tipoId: number;
};

const rutaEquipos = EQUIPOS_ROUTE;

export const EditarTipoModal = (props: EditTipoModalProps) => {
  return (
    <Link key={props.tipoId} href={`${rutaEquipos.href}/tipos/${props.tipoId}`} passHref prefetch={false}>
      <EditIcon />
    </Link>
  );
};
