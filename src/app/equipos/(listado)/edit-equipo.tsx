import { EditIcon } from "lucide-react";
import Link from "next/link";

type EditEquipoModalProps = {
  equipoId: number;
};

export const EditarEquipoModal = (props: EditEquipoModalProps) => {
  return (
    <Link key={props.equipoId} href={`/equipos/equipo/${props.equipoId}`} passHref prefetch={false}>
      <EditIcon />
    </Link>
  );
};
