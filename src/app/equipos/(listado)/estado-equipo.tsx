import { Badge } from "@/components/ui/badge";
import PrestarEquipoModal from "../_components/modal-prestar";

type EstadoEquipoProps = {
  id: number;
  disponible: boolean;
};

export default function EstadoEquipo({ disponible, id }: EstadoEquipoProps) {
  if (disponible) {
    return (
      <div className="flex flex-col">
        <Badge variant={"default"} color={"success"} className="w-full text-center">
          <div className="w-full">Disponible</div>
        </Badge>
        {<PrestarEquipoModal equipoId={id} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Badge variant={"default"} color={"danger"} className="w-full text-center">
        <div className="w-full">Prestado</div>
      </Badge>
      {/* <DevolverLibroModal libroId={id} /> */}
    </div>
  );
}
