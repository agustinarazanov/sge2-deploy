import { Button } from "@/components/ui";
import { FormSelect } from "@/components/ui/autocomplete";
import { type Control } from "react-hook-form";
import { type FormEditarCursoType } from "../curso/[id]/curso-form";

type Props = {
  control: Control<FormEditarCursoType, unknown>;
  dias: { id: string; label: string }[];
  horas: { id: string; label: string }[];
  duracion: { id: string; label: string }[];
  onRemove: () => void;
};

export const DiaAdicionalForm = ({ control, dias, horas, duracion, onRemove }: Props) => {
  return (
    <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
      <div className="mt-4 w-full">
        <FormSelect label={"Día 2"} control={control} name="dia2" className="mt-2" items={dias} />
      </div>

      <div className="mt-4 w-full">
        <FormSelect label={"Hora inicio 2"} control={control} name="horaInicio2" className="mt-2" items={horas} />
      </div>

      <div className="mt-4 w-full">
        <FormSelect label={"Duración 2"} control={control} name="duracion2" className="mt-2" items={duracion} />
      </div>

      <div className="mt-10">
        <Button type="button" className="mt-4" onClick={onRemove} variant={"default"} color={"danger"}>
          Eliminar día 2
        </Button>
      </div>
    </div>
  );
};
