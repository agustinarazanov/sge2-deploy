import { EyeIcon } from "lucide-react";
import Link from "next/link";

type VerLibroModalProps = {
  libroId: number;
};

export const VerLibroModal = (props: VerLibroModalProps) => {
  return (
    <Link key={props.libroId} href={`/biblioteca/libros/ver/${props.libroId}`} passHref prefetch={false}>
      <EyeIcon />
    </Link>
  );
};
