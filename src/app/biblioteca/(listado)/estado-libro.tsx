import { Badge } from "@/components/ui/badge";
import PrestarLibroModal from "../_components/modal-prestar";

type RemoveLibroModalProps = {
  id: number;
  disponible: boolean;
};

export default function EstadoLibro({ disponible, id }: RemoveLibroModalProps) {
  if (disponible) {
    return (
      <div className="flex flex-col">
        <Badge variant={"default"} color={"success"} className="w-full text-center">
          <div className="w-full">Disponible</div>
        </Badge>
        <PrestarLibroModal libroId={id} />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Badge variant={"default"} color={"danger"} className="w-full text-center">
        <div className="w-full">Prestado</div>
      </Badge>
    </div>
  );
}
