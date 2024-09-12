import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/badge";

type RemoveLibroModalProps = {
  id: number;
  disponible: boolean;
};

export default function EstadoLibro({ disponible }: RemoveLibroModalProps) {
  if (disponible) {
    return (
      <div className="flex flex-col">
        <Badge variant={"default"} color={"success"} className="w-full text-center">
          <div className="w-full">Disponible</div>
        </Badge>
        <Button
          title="Prestar"
          variant="default"
          color="outline"
          size="sm"
          className="mt-2 w-full rounded-full border-none"
        >
          Prestar
        </Button>
      </div>
    );
  }

  return (
    <Badge variant={"default"} color={"danger"}>
      Prestado
    </Badge>
  );
}
