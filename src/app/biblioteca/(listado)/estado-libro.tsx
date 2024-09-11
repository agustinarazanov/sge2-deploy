import { Badge } from "@/components/ui/badge";

type RemoveLibroModalProps = {
  id: number;
  disponible: boolean;
};

export default function EstadoInventario({ disponible }: RemoveLibroModalProps) {
  if (disponible) {
    return (
      <Badge variant={"default"} color={"success"}>
        Disponible
      </Badge>
    );
  }

  return (
    <Badge variant={"default"} color={"danger"}>
      Prestado
    </Badge>
  );
}
