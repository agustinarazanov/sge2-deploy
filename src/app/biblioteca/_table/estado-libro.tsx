import { Badge } from "@/components/ui/badge";
import { type RouterOutputs } from "@/trpc/react";

type EstadoType = RouterOutputs["biblioteca"]["getAll"]["libros"][number]["estado"];

type RemoveLibroModalProps = {
  libroId: number;
  estado: EstadoType;
};

export default function EstadoLibro({ libroId, estado }: RemoveLibroModalProps) {
  // TODO: Modify state onClick

  if (estado === "prestado") {
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
