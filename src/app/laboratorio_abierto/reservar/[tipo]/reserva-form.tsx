import { FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Input, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect } from "react";
import { inputReservaLaboratorioAbierto } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { FormTextarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MinusIcon } from "lucide-react";
import { EquipoTipoSelector } from "@/app/laboratorios/mis_cursos/_components/filtros/equipo-tipo-selector";
import { type LaboratorioAbiertoType } from "../_components/laboratorios";
import { Slider } from "@/components/ui/slider";
import { FormSelect } from "@/components/ui/autocomplete";

type Props = {
  tipo: LaboratorioAbiertoType;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormReservarLaboratorioAbiertoType = z.infer<typeof inputReservaLaboratorioAbierto>;

export const LaboratorioAbiertoForm = ({ tipo, onSubmit, onCancel }: Props) => {
  const { data: todosLosEquiposTipo } = api.equipos.getAllTipos.useQuery({ tipoId: undefined });
  const reservarLaboratorio = api.reservas.reservaLaboratorioAbierto.crearReserva.useMutation();

  const formHook = useForm<FormReservarLaboratorioAbiertoType>({
    mode: "onChange",
    defaultValues: {
      tipo: tipo!,
      aceptoTerminos: false,
      concurrentes: 1,
      equipoRequerido: [],
      fechaReserva: undefined,
      horaInicio: undefined,
      horaFin: undefined,
      observaciones: "",
      sedeId: 1,
    },
    resolver: zodResolver(inputReservaLaboratorioAbierto),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => {
    formHook.reset({
      tipo: tipo!,
      aceptoTerminos: false,
      concurrentes: 1,
      equipoRequerido: [],
      fechaReserva: undefined,
      horaInicio: undefined,
      horaFin: undefined,
      observaciones: "",
      sedeId: 1,
    });
  }, [formHook, tipo]);

  const onFormSubmit = async (_formData: FormReservarLaboratorioAbiertoType) => {
    reservarLaboratorio.mutate(_formData, {
      onSuccess: () => {
        toast.success("Reserva creada con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al crear la reserva");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  const onEquipoTipoChange = (equipoTipoId: string) => {
    const equipos = formHook.getValues("equipoRequerido");

    const existeEquipo = equipos.find((equipo) => equipo.idTipo === equipoTipoId);

    if (existeEquipo) {
      return;
    } else {
      formHook.setValue("equipoRequerido", [...equipos, { idTipo: equipoTipoId, cantidad: 1 }]);
      return;
    }
  };

  const onEquipoTipoDelete = (equipoTipoId: string) => {
    const equipos = formHook.getValues("equipoRequerido");

    formHook.setValue(
      "equipoRequerido",
      equipos.filter((equipo) => equipo.idTipo !== equipoTipoId),
    );
  };

  const currentEquipoTipo = formHook.watch("equipoRequerido");

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex flex-col space-y-4 px-0">
            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Tipo de laboratorio"}
                  control={control}
                  name="tipo"
                  className="mt-2"
                  type={"text"}
                  readOnly
                />
              </div>
              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Fecha de reserva"}
                  control={control}
                  name="fechaReserva"
                  className="mt-2"
                  type={"date"}
                  required
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Hora de inicio"}
                  control={control}
                  name="fechaReserva"
                  className="mt-2"
                  type={"time"}
                  required
                />
              </div>
              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Hora de fin"}
                  control={control}
                  name="fechaReserva"
                  className="mt-2"
                  type={"time"}
                  required
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full">
                <label htmlFor="">¿Cuántas personas concurrirán al Laboratorio?</label>
                <Slider defaultValue={[1]} min={0} max={8} step={1} className={"w-full"} />
              </div>
            </div>

            <div className="flex w-full flex-col justify-end gap-y-4 lg:justify-between">
              <div className="items-top flex space-x-2">
                <FormSelect
                  label={"Sede"}
                  name="sedeId"
                  className="mt-2 basis-1/2"
                  control={control}
                  items={[
                    { id: "1", label: "Medrano" },
                    { id: "2", label: "Lugano" },
                  ]}
                />
              </div>
            </div>

            <div className="flex w-full flex-col justify-end gap-y-4 lg:justify-between">
              <div className="items-top flex space-x-2">
                <Checkbox id="equipoRequerido" name="equipoRequerido" />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="equipoRequerido">Requiere instumental</label>
                </div>
              </div>

              {/* TODO: Habilitar seccion solo si requiere instrumental = true */}
              <div className="mt-4 w-full">
                <EquipoTipoSelector onEquipoTipoChange={onEquipoTipoChange} />
              </div>

              <div className="mt-4 w-full">
                <ScrollArea className="max-h-80 w-full">
                  <div className="flex w-full flex-col">
                    {currentEquipoTipo?.map((equipoTipo) => (
                      <div key={equipoTipo.idTipo} className="flex w-full flex-row gap-x-4 pl-4">
                        <Input
                          readOnly
                          value={
                            todosLosEquiposTipo?.tipos?.find((equipo) => String(equipo.id) === equipoTipo.idTipo)
                              ?.nombre ?? ""
                          }
                          className="mt-2 grow basis-2/3"
                        />
                        <Input readOnly value={equipoTipo.cantidad} type="number" className="mt-2 grow basis-1/3" />
                        <Button
                          type="button"
                          variant={"icon"}
                          icon={MinusIcon}
                          size="sm"
                          className="mt-2 rounded-md border-none"
                          onClick={() => onEquipoTipoDelete(equipoTipo.idTipo)}
                          title={`Eliminar ${equipoTipo.idTipo} equipo`}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full">
                <FormTextarea label={"Observaciones"} control={control} name="observaciones" className="mt-2 w-full" />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4">
                <div className="items-top flex space-x-2">
                  <Checkbox id="aceptoTerminos" name="aceptoTerminos" className="mt-2" />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <b> Declaro conocer las nuevas políticas de uso de laboratorio</b>
                    </label>
                    <p className="text-sm text-muted-foreground">
                      La política de uso de laboratorio ha cambiado, TODO: LINK
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row items-end justify-end space-x-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button title="Guardar" type="submit" variant="default" color="primary">
            Guardar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
