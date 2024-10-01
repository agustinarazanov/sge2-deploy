import { api } from "@/trpc/react";
import { useEffect, useMemo, useState } from "react";
import { estaDentroDe } from "@/shared/string-compare";
import { Skeleton } from "@/components/ui/skeleton";
import { Autocomplete, Button, Input, ScrollArea, Select, SelectTrigger, SelectValue } from "@/components/ui";
import { MinusIcon } from "lucide-react";
import { type Control, type FieldValues, type Path, useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { type FormReservarLaboratorioAbiertoType } from "@/app/laboratorio_abierto/reservar/[tipo]/reserva-form";

type Props = {
  onEquipoTipoChange: (id: number) => void;
  label?: string;
  disabled?: boolean;
};

export interface FormInputEquipoProps<T extends FieldValues> extends React.TextareaHTMLAttributes<HTMLSelectElement> {
  control: Control<T>;
  name: Path<T>;
  currentEquipoTipo: {
    id: number;
    cantidad: number;
  }[];
}

export const EquipoTipoSelector = ({ onEquipoTipoChange, label, disabled }: Props) => {
  const { data, isLoading, isError } = api.equipos.getAllTipos.useQuery({ tipoId: undefined });

  const [query, setQuery] = useState("");

  const equiposTipo = useMemo(() => {
    if (!data) return [];

    return data.tipos
      .map((item) => {
        const { id, nombre } = item;
        return {
          id: id,
          label: nombre,
          data: item,
        };
      })
      .filter((item) => !query || estaDentroDe(query, item.label));
  }, [data, query]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex flex-row items-center space-x-2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full">
        <Select>
          <div className="flex flex-row items-center space-x-2">
            <SelectTrigger
              disabled
              id="selectEquipoTipo"
              className="h-10 transition-colors focus:border-primary focus:ring-0 group-hover:border-input-hover"
            >
              <SelectValue placeholder="Error cargando equipos" />
            </SelectTrigger>
          </div>
        </Select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Autocomplete
        label={label ?? ""}
        async
        items={equiposTipo}
        noOptionsComponent={
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm text-white">
            <span>No se encontraron equipos</span>
          </div>
        }
        className={""}
        onQueryChange={setQuery}
        isLoading={isLoading}
        placeholder="Buscar por tipo de equipo"
        clearable
        debounceTime={0}
        onChange={(value) => value && onEquipoTipoChange(Number(value?.id))}
        disabled={disabled}
      />
    </div>
  );
};

export const FormEquipoTipoSelector = <T extends FieldValues>({ name: nombre }: { name: Path<T> }) => {
  if (nombre !== "equipoReservado") {
    // Hack: Si el nombre del campo es diferente a "equipoReservado", lanza una excepción para que el usuario sepa que debe usar el componente con el nombre correcto
    throw new Error("El nombre del campo debe ser 'equipoReservado'");
  }

  const name = "equipoReservado";

  const formHook = useFormContext<FormReservarLaboratorioAbiertoType>();

  const currentEquipoTipo = formHook.watch(name);

  const [requiereInstrumental, setRequiereInstrumental] = useState(false);

  useEffect(() => {
    setRequiereInstrumental(currentEquipoTipo.length > 0);
  }, [currentEquipoTipo]);

  const { data: todosLosEquiposTipo } = api.equipos.getAllTipos.useQuery({ tipoId: undefined, getAll: true });

  const onEquipoTipoChange = (equipoTipoId: number) => {
    const equipos = formHook.getValues(name);

    const existeEquipo = equipos.find((equipo) => equipo.id === equipoTipoId);

    if (existeEquipo) {
      return;
    } else {
      formHook.setValue(name, [...equipos, { id: equipoTipoId, cantidad: 1 }]);
      return;
    }
  };

  const onEquipoTipoDelete = (equipoTipoId: number) => {
    const equipos = formHook.getValues(name);

    formHook.setValue(
      name,
      equipos.filter((equipo) => equipo.id !== equipoTipoId),
    );
  };

  const onEquipoCambiarCantidad = (equipoTipoId: number, cantidad: number) => {
    const equipos = formHook.getValues(name);

    const newEquipos = equipos.map((equipo) => {
      if (equipo.id === equipoTipoId) {
        return { ...equipo, cantidad };
      }

      return equipo;
    });

    formHook.setValue(name, newEquipos);
  };

  return (
    <div className="flex w-full flex-col justify-end gap-y-4 lg:justify-between">
      <div className="items-top flex space-x-2">
        <label
          htmlFor={name}
          className="flex w-full items-center justify-between rounded-md border border-white p-2 hover:cursor-pointer hover:bg-gray-500"
        >
          <div className="text-base">Requiere instumental</div>
          <Switch id={name} checked={requiereInstrumental} onCheckedChange={setRequiereInstrumental} />
        </label>
      </div>

      {requiereInstrumental && (
        <>
          <div className="mt-4 w-full">
            <EquipoTipoSelector onEquipoTipoChange={onEquipoTipoChange} />
          </div>

          <div className="mt-4 w-full">
            <ScrollArea className="max-h-80 w-full">
              <div className="flex w-full flex-col">
                {currentEquipoTipo?.map((equipoTipo) => {
                  const currentEquipo = todosLosEquiposTipo?.tipos?.find((equipo) => equipo.id === equipoTipo.id);

                  return (
                    <div key={equipoTipo.id} className="flex w-full flex-row gap-x-4 pl-4">
                      <Input readOnly value={currentEquipo?.nombre ?? ""} className="mt-2 grow basis-2/3" />
                      <Input
                        value={equipoTipo.cantidad}
                        onChange={(event) => {
                          const value = event.target.value;

                          if (value === "") {
                            onEquipoCambiarCantidad(equipoTipo.id, 0);
                            return;
                          }

                          onEquipoCambiarCantidad(equipoTipo.id, Number(value));
                        }}
                        type="number"
                        className="mt-2 grow basis-1/3"
                        min={1}
                        step={1}
                      />
                      <Button
                        type="button"
                        variant={"icon"}
                        icon={MinusIcon}
                        size="sm"
                        className="mt-2 rounded-md border-none"
                        onClick={() => onEquipoTipoDelete(equipoTipo.id)}
                        title={`Eliminar ${currentEquipo?.nombre} de la reserva`}
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
};
