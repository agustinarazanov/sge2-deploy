import { ADMIN_ROUTE } from "@/shared/server-routes";
import { EditIcon } from "lucide-react";
import Link from "next/link";

type EditLibroModalProps = {
  rolId: number;
};

const rutaAdmin = ADMIN_ROUTE;

export const EditarRolModal = (props: EditLibroModalProps) => {
  return (
    <Link key={props.rolId} href={`${rutaAdmin.href}/libros/${props.rolId}`} passHref prefetch={false}>
      <EditIcon />
    </Link>
  );
};
