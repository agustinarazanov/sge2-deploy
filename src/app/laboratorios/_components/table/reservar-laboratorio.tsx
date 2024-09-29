import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type EditCursoModalProps = {
  cursoId: number;
};

export const ReservarLaboratorioCerradoModal = (props: EditCursoModalProps) => {
  const pathname = usePathname();

  return (
    <Link key={props.cursoId} href={`${pathname}/${props.cursoId}`} passHref prefetch={true} title="Reservar curso">
      <CalendarCheck />
    </Link>
  );
};
