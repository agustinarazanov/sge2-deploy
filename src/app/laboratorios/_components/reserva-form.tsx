/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Input, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect } from "react";
import {
  inputReservaLaboratorioCerrado,
  inputReservaLaboratorioDiscrecional,
} from "@/shared/filters/reserva-laboratorio-filter.schema";
import { FormTextarea } from "@/components/ui/textarea";
import { MinusIcon } from "lucide-react";
import { EquipoTipoSelector } from "./filtros/equipo-tipo-selector";
import { CursoTurno, turnosValues } from "@/app/_components/turno-text";
import { Switch } from "@/components/ui/switch";
import { FormSelect } from "@/components/ui/autocomplete";
import { FormInputPoliticas } from "@/app/_components/input-form-politicas";

type Props = {
  cursoId?: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type FormReservarLaboratorioType =
  | z.infer<typeof inputReservaLaboratorioCerrado>
  | z.infer<typeof inputReservaLaboratorioDiscrecional>;

export const LaboratorioCerradoForm = ({ cursoId, onCancel }: Props) => {
  const esDiscrecional = !cursoId;
  const {
    data: curso,
    isLoading,
    isError,
  } = api.cursos.cursoPorId.useQuery({ id: Number(cursoId!) }, { enabled: !esDiscrecional });

  const { data: todosLosEquiposTipo } = api.equipos.getAllTipos.useQuery({ tipoId: undefined });

  const formHook = useForm<FormReservarLaboratorioType>({
    mode: "onChange",
    defaultValues: {
      cursoId: cursoId ? Number(cursoId) : undefined,
      aceptoTerminos: false,
      requiereEquipo: false,
      equipoRequerido: [],
      fechaReserva: undefined,
      requierePc: false,
      requiereProyector: false,
      turno: curso?.turno ?? "MANANA",
    },
    resolver: zodResolver(esDiscrecional ? inputReservaLaboratorioDiscrecional : inputReservaLaboratorioCerrado),
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => {
    formHook.reset({
      cursoId: Number(cursoId),
      aceptoTerminos: false,
      equipoRequerido: [],
      fechaReserva: undefined,
      requierePc: false,
      requiereProyector: false,
    });
  }, [formHook, cursoId]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = (_formData: FormReservarLaboratorioType) => {
    if (esDiscrecional) {
      toast.success("Reserva discrecional creada con éxito.");
    } else {
      toast.success("Reserva creada con éxito.");
    }
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

  const onEquipoCambiarCantidad = (equipoTipoId: string, cantidad: number) => {
    const equipos = formHook.getValues("equipoRequerido");

    const newEquipos = equipos.map((equipo) => {
      if (equipo.idTipo === equipoTipoId) {
        return { ...equipo, cantidad };
      }

      return equipo;
    });

    formHook.setValue("equipoRequerido", newEquipos);
  };

  const currentEquipoTipo = formHook.watch("equipoRequerido");
  const requiereEquipo = formHook.watch("requiereEquipo");

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex flex-col space-y-4 px-0 md:px-6">
            {!esDiscrecional && (
              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 w-full">
                  <Input
                    label={"Materia"}
                    name="materia"
                    type={"text"}
                    className="mt-2"
                    value={curso?.materia.nombre ?? ""}
                    readOnly
                  />
                </div>
                <div className="mt-4 w-full">
                  <Input
                    label={"División"}
                    name="division"
                    type={"text"}
                    className="mt-2"
                    value={curso?.division.nombre ?? ""}
                    readOnly
                  />
                </div>
              </div>
            )}

            {!esDiscrecional && (
              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 w-full">
                  <Input
                    label={"Turno"}
                    name="turno"
                    type={"text"}
                    className="mt-2"
                    value={CursoTurno({ turno: curso?.turno })}
                    readOnly
                  />
                </div>
                <div className="mt-4 w-full">
                  <Input
                    label={"Sede"}
                    name="sede"
                    type={"text"}
                    className="mt-2"
                    value={curso?.sede.nombre ?? ""}
                    readOnly
                  />
                </div>
              </div>
            )}

            {!esDiscrecional && (
              <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
                <div className="mt-4 w-full">
                  <Input
                    label={"Profesor"}
                    name="profesor"
                    type={"text"}
                    className="mt-2"
                    value={`${curso?.profesor.nombre} ${curso?.profesor.apellido}`}
                    readOnly
                  />
                </div>
                <div className="mt-4 w-full">
                  <Input
                    label={"Ayudante/s"}
                    name="ayudante"
                    type={"text"}
                    className="mt-2"
                    value={curso?.ayudantes.map((ayudante) => ayudante.usuario.apellido).join(", ") ?? ""}
                    readOnly
                  />
                </div>
              </div>
            )}

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              {esDiscrecional && (
                <div className="mt-4 w-full">
                  <FormSelect label={"Turno"} name="turno" className="mt-2" items={turnosValues} control={control} />
                </div>
              )}
              <div className="mt-4 basis-1/3">
                {/* TODO: Habilitar fecha de reserva a los días de curso */}
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

            <div className="flex w-full flex-col justify-end gap-y-4 lg:justify-between">
              <div className="items-top flex space-x-2">
                <Controller
                  control={control}
                  name="requierePc"
                  render={({ field }) => (
                    <label
                      htmlFor="requierePc"
                      className="flex w-full items-center justify-between rounded-md border border-white p-2 hover:cursor-pointer hover:bg-gray-500"
                    >
                      <div className="text-base">Requiere PCs para los alumnos</div>
                      <Switch id="requierePc" checked={field.value} onCheckedChange={field.onChange} />
                    </label>
                  )}
                />
              </div>

              <div className="items-top flex space-x-2">
                <Controller
                  control={control}
                  name="requiereProyector"
                  render={({ field }) => (
                    <label
                      htmlFor="requiereProyector"
                      className="flex w-full items-center justify-between rounded-md border border-white p-2 hover:cursor-pointer hover:bg-gray-500"
                    >
                      <div className="text-base">Requiere proyector</div>
                      <Switch id="requiereProyector" checked={field.value} onCheckedChange={field.onChange} />
                    </label>
                  )}
                />
              </div>
            </div>

            <div className="flex w-full flex-col justify-end gap-y-4 lg:justify-between">
              <div className="items-top flex space-x-2">
                <Controller
                  control={control}
                  name="requiereEquipo"
                  render={({ field }) => (
                    <label
                      htmlFor="requiereEquipo"
                      className="flex w-full items-center justify-between rounded-md border border-white p-2 hover:cursor-pointer hover:bg-gray-500"
                    >
                      <div className="text-base">Requiere instumental</div>
                      <Switch id="requiereEquipo" checked={field.value} onCheckedChange={field.onChange} />
                    </label>
                  )}
                />
              </div>

              {requiereEquipo && (
                <>
                  <div className="mt-4 w-full">
                    <EquipoTipoSelector onEquipoTipoChange={onEquipoTipoChange} />
                  </div>

                  <div className="mt-4 w-full">
                    <ScrollArea className="max-h-80 w-full">
                      <div className="flex w-full flex-col">
                        {currentEquipoTipo?.map((equipoTipo) => {
                          const currentEquipo = todosLosEquiposTipo?.tipos?.find(
                            (equipo) => String(equipo.id) === equipoTipo.idTipo,
                          );

                          return (
                            <div key={equipoTipo.idTipo} className="flex w-full flex-row gap-x-4 pl-4">
                              <Input readOnly value={currentEquipo?.nombre ?? ""} className="mt-2 grow basis-2/3" />
                              <Input
                                value={equipoTipo.cantidad}
                                onChange={(event) => {
                                  const value = event.target.value;

                                  if (value === "") {
                                    onEquipoCambiarCantidad(equipoTipo.idTipo, 0);
                                    return;
                                  }

                                  onEquipoCambiarCantidad(equipoTipo.idTipo, Number(value));
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
                                onClick={() => onEquipoTipoDelete(equipoTipo.idTipo)}
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

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full">
                <FormTextarea
                  label={"Observaciones"}
                  control={control}
                  name="observaciones"
                  className="mt-2 w-full"
                  maxLength={250}
                />
                <small className="text-sm text-muted-foreground">
                  {250 - formHook.watch("observaciones")?.length} caracteres restantes
                </small>
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4">
                <div className="items-top flex space-x-2">
                  <FormInputPoliticas name="aceptoTerminos" control={control} />
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
            Realizar reserva
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
