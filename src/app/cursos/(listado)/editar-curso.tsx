import { CURSOS_ROUTE } from "@/shared/server-routes";
import { EditIcon } from "lucide-react";
import Link from "next/link";

type EditCursoModalProps = {
  cursoId: number;
};

const rutaCurso = CURSOS_ROUTE;

export const EditCursoModal = (props: EditCursoModalProps) => {
  return (
    <Link key={props.cursoId} href={`${rutaCurso.href}/curso/${props.cursoId}`} passHref prefetch={false}>
      <EditIcon />
    </Link>
  );
};
