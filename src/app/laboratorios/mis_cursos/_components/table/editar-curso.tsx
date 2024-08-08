import { LABORATORIO_ROUTE } from "@/shared/server-routes";
import { CalendarCheck } from "lucide-react";
import Link from "next/link";

type EditCursoModalProps = {
  cursoId: number;
};

const rutaCurso = LABORATORIO_ROUTE;

export const ReservarLaboratorioCerradoModal = (props: EditCursoModalProps) => {
  return (
    <Link
      key={props.cursoId}
      href={`${rutaCurso.href}/mis_cursos/${props.cursoId}`}
      passHref
      prefetch={true}
      title="Reservar curso"
    >
      <CalendarCheck />
    </Link>
  );
};
