import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/components/utils";
import { ReservaEstatus } from "@prisma/client";

export const EstadoReservaToString = ({
  handleEstadoChange,
  currentEstado,
}: {
  handleEstadoChange: (estado: ReservaEstatus) => void;
  currentEstado: string;
}) => {
  return (
    <ToggleGroup type="single" className="flex flex-row">
      <ToggleGroupItem
        value={ReservaEstatus.CANCELADA}
        aria-label="Cambiar a pendientes"
        className={cn("basis-1/3 hover:bg-primary", { "bg-primary": currentEstado === ReservaEstatus.CANCELADA })}
        onClick={() => handleEstadoChange(ReservaEstatus.CANCELADA)}
      >
        Canceladas
      </ToggleGroupItem>
      <ToggleGroupItem
        value={ReservaEstatus.RECHAZADA}
        aria-label="Cambiar a pendientes"
        className={cn("basis-1/3 hover:bg-primary", { "bg-primary": currentEstado === ReservaEstatus.RECHAZADA })}
        onClick={() => handleEstadoChange(ReservaEstatus.RECHAZADA)}
      >
        Rechazadas
      </ToggleGroupItem>
      <ToggleGroupItem
        value={ReservaEstatus.PENDIENTE}
        aria-label="Cambiar a pendientes"
        className={cn("basis-1/3 hover:bg-primary", { "bg-primary": currentEstado === ReservaEstatus.PENDIENTE })}
        onClick={() => handleEstadoChange(ReservaEstatus.PENDIENTE)}
      >
        Pendientes
      </ToggleGroupItem>
      <ToggleGroupItem
        value={ReservaEstatus.FINALIZADA}
        aria-label="Cambiar a finalizadas"
        className={cn("basis-1/3 hover:bg-primary", { "bg-primary": currentEstado === ReservaEstatus.FINALIZADA })}
        onClick={() => handleEstadoChange(ReservaEstatus.FINALIZADA)}
      >
        Finalizadas
      </ToggleGroupItem>
      <ToggleGroupItem
        value={""}
        aria-label="Cambiar a ambos"
        className={cn("basis-1/3 hover:bg-primary", { "bg-primary": currentEstado === "" })}
        onClick={() => handleEstadoChange("" as ReservaEstatus)}
      >
        Todas
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
