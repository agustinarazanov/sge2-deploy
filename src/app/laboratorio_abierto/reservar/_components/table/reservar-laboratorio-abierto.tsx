import { LABORATORIO_ABIERTO_ROUTE, LABORATORIO_ROUTE } from "@/shared/server-routes";
import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { LaboratorioAbiertoType } from "../laboratorios";

type EditCursoModalProps = {
  laboratorioAbiertoTipo: LaboratorioAbiertoType;
};

const rutaCurso = LABORATORIO_ABIERTO_ROUTE;

export const ReservarLaboratorioAbiertoModal = (props: EditCursoModalProps) => {
  return (
    <Link
      key={props.laboratorioAbiertoTipo}
      href={`${rutaCurso.href}/reservar/${props.laboratorioAbiertoTipo}`}
      passHref
      prefetch={true}
      title="Reservar laboratorio abierto"
    >
      <CalendarCheck />
    </Link>
  );
};
