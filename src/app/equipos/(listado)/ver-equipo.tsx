import { EyeIcon } from "lucide-react";
import Link from "next/link";

type VerEquipoModalProps = {
  equipoId: number;
};

export const VerEquipoModal = (props: VerEquipoModalProps) => {
  return (
    <Link key={props.equipoId} href={`/equipos/equipo/ver/${props.equipoId}`} passHref prefetch={false}>
      <EyeIcon />
    </Link>
  );
};
