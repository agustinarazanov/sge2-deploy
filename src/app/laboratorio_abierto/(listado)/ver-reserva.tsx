import { EyeIcon } from "lucide-react";
import Link from "next/link";

type VerReservaModalProps = {
  reservaID: number;
};

export const VerReservaModal = (props: VerReservaModalProps) => {
  return (
    <Link key={props.reservaID} href={`/laboratorio_abierto/reservas/ver/${props.reservaID}`} passHref prefetch={false}>
      <EyeIcon />
    </Link>
  );
};
