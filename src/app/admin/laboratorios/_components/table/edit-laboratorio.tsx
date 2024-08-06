import { ADMIN_ROUTE } from "@/shared/server-routes";
import { EditIcon } from "lucide-react";
import Link from "next/link";

type EditarLaboratorioModalProps = {
  laboratorioId: number;
};

const rutaAdmin = ADMIN_ROUTE;

export const EditarLaboratorioModal = ({ laboratorioId }: EditarLaboratorioModalProps) => {
  return (
    <Link key={laboratorioId} href={`${rutaAdmin.href}/laboratorios/${laboratorioId}`} passHref prefetch={false}>
      <EditIcon />
    </Link>
  );
};
