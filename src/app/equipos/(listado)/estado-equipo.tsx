import { Badge } from "@/components/ui/badge";
import { type RouterOutputs } from "@/trpc/react";

type EstadoType = RouterOutputs["equipos"]["getAll"]["equipos"][number];

type RemoveEquipoModalProps = {
  equipoId: number;
  estado: EstadoType;
};

export default function EstadoEquipo({ estado }: RemoveEquipoModalProps) {
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
