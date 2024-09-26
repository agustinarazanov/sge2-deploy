import { Button, ScrollArea } from "@/components/ui";
import { Separator } from "@radix-ui/react-separator";
import { UsuarioCreador } from "../../_components/usuario-creador-equipo";
import { EquipoInformacionBasica } from "../../_components/info-basica-equipo";
import { EquipoInformacionUbicacion } from "../../_components/info-ubicacion-equipo";
import { EquipoInformacionPrestamos } from "../../_components/info-prestamos-equipo";

type Props = {
  id?: string;
  onCancel: () => void;
};

export const EquipoView = ({ id, onCancel }: Props) => {
  const equipoId = parseInt(id ?? "");

  const handleCancel = () => onCancel();

  return (
    <div className="relative flex w-full flex-col gap-4">
      <ScrollArea className="flex max-h-[calc(100vh_-_30%)] w-full flex-col pr-4">
        <div className="my-8 flex w-full flex-col items-center justify-center">
          <EquipoInformacionBasica equipoId={equipoId} />
        </div>

        <Separator className="my-2 border-2" />

        <div className="my-8 flex w-full flex-col items-center justify-center">
          <EquipoInformacionUbicacion equipoId={equipoId} />
        </div>

        <Separator className="my-2 border-2" />

        <div className="my-8 flex w-full flex-col items-center justify-center">
          <EquipoInformacionPrestamos equipoId={equipoId} />
        </div>

        <Separator className="my-2 border-2" />

        <div className="my-8 flex w-full flex-col items-center justify-center">
          <UsuarioCreador equipoId={equipoId} />
        </div>
      </ScrollArea>

      <div className="mb-3 flex w-full flex-row items-end justify-center space-x-4 md:justify-end">
        <Button title="Volver" type="button" variant="default" color="primary" onClick={handleCancel}>
          Volver
        </Button>
      </div>
    </div>
  );
};
