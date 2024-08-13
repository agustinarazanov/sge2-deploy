import { LABORATORIO_ABIERTO_ROUTE } from "@/shared/server-routes";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { type LaboratorioAbiertoType } from "../laboratorios";
import { Button } from "@/components/ui";

type EditCursoModalProps = {
  tipo: LaboratorioAbiertoType;
};

const rutaCurso = LABORATORIO_ABIERTO_ROUTE;

export const ReservarLaboratorioAbiertoModal = (props: EditCursoModalProps) => {
  return (
    <Link
      key={props.tipo}
      href={`${rutaCurso.href}/reservar/${props.tipo}`}
      passHref
      prefetch={true}
      title="Reservar laboratorio abierto"
      className="w-full"
    >
      <Button className="w-full">
        <CalendarIcon className="mr-2 h-4 w-4" /> Reservar
      </Button>
    </Link>
  );
};
