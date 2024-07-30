import { EditIcon } from "lucide-react";
import Link from "next/link";

type EditLibroModalProps = {
  libroId: number;
};

export const EditLibroModal = (props: EditLibroModalProps) => {
  return (
    <Link key={props.libroId} href={`/biblioteca/${props.libroId}`} passHref prefetch={false}>
      <EditIcon />
    </Link>
  );
};
