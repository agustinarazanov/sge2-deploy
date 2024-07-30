import { Badge } from "@/components/ui/badge";
import { type RouterOutputs } from "@/trpc/react";

type EstadoType = RouterOutputs["biblioteca"]["getAll"]["libros"][number]["disponible"];

type RemoveLibroModalProps = {
  libroId: number;
  estado: EstadoType;
};

export default function EstadoLibro({ libroId, estado }: RemoveLibroModalProps) {
  if (!estado) {
    return (
      <Badge variant={"default"} color={"danger"}>
        Prestado
      </Badge>
    );
  }

  return (
    <Badge variant={"default"} color={"success"}>
      Disponible
    </Badge>
  );
}
