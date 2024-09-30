import { Controller, FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Input, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useState } from "react";
import {
  inputEditarReservaLaboratorioAbiertoSchema,
  inputReservaLaboratorioAbierto,
} from "@/shared/filters/reserva-laboratorio-filter.schema";
import { FormTextarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MinusIcon } from "lucide-react";
import { EquipoTipoSelector } from "@/app/laboratorios/_components/filtros/equipo-tipo-selector";
import { type LaboratorioAbiertoType } from "../_components/laboratorios";
import { Slider } from "@/components/ui/slider";
import { SelectSedeForm } from "@/app/_components/select-ubicacion/select-sede";
import { getDateISOString, getTimeISOString } from "@/shared/get-date";
import { SelectEspecialidadForm } from "@/app/_components/select-especialidad";
import { FormInputPoliticas } from "@/app/_components/input-form-politicas";

type Props = {
  onSubmit: () => void;
  onCancel: () => void;
} & ({ reservaId: number; tipo?: undefined } | { reservaId?: undefined; tipo: LaboratorioAbiertoType });

type FormReservarLaboratorioAbiertoType = z.infer<typeof inputEditarReservaLaboratorioAbiertoSchema>;

export const LaboratorioAbiertoForm = ({ tipo, reservaId, onSubmit, onCancel }: Props) => {
  const esNuevo = reservaId === undefined;

  const { data: todosLosEquiposTipo } = api.equipos.getAllTipos.useQuery({ tipoId: undefined });
  const crearReservaLaboratorioAbierto = api.reservas.reservaLaboratorioAbierto.crearReserva.useMutation();
  const modificarReservaLaboratorioAbierto = api.reservas.reservaLaboratorioAbierto.editarReserva.useMutation();
  const cancelarReservaLaboratorioAbierto = api.reservas.reservaLaboratorioAbierto.cancelarReserva.useMutation();
  const { data: reservaData } = api.reservas.reservaLaboratorioAbierto.getReservaPorID.useQuery(
    {
      id: reservaId!,
    },
    {
      enabled: !esNuevo,
    },
  );

  const esTLA = tipo === "TLA" || reservaData?.laboratorioAbiertoTipo === "TLA";

  const formHook = useForm<FormReservarLaboratorioAbiertoType>({
    mode: "onChange",
    defaultValues: {
      id: reservaId,
      tipo: esNuevo ? tipo! : reservaData?.laboratorioAbiertoTipo,
      aceptoTerminos: false,
      concurrentes: esNuevo ? 1 : reservaData?.concurrentes,
      equipoRequerido: [],
      fechaReserva: esNuevo ? undefined : getDateISOString(reservaData?.reserva.fechaHoraInicio as unknown as Date),
      horaInicio: esNuevo ? undefined : getTimeISOString(reservaData?.reserva.fechaHoraInicio as unknown as Date),
      horaFin: esNuevo ? undefined : getTimeISOString(reservaData?.reserva.fechaHoraFin as unknown as Date),
      observaciones: esNuevo ? "" : (reservaData?.descripcion ?? ""),
      sedeId: esNuevo ? undefined : String(reservaData?.sedeId),
    },
    resolver: zodResolver(esNuevo ? inputReservaLaboratorioAbierto : inputEditarReservaLaboratorioAbiertoSchema),
  });

  const { handleSubmit, control, setValue } = formHook;

  useEffect(() => {
    if (reservaData) {
      formHook.reset({
        id: reservaId,
        tipo: esNuevo ? tipo! : reservaData?.laboratorioAbiertoTipo,
        aceptoTerminos: false,
        concurrentes: esNuevo ? 1 : reservaData?.concurrentes,
        equipoRequerido: [],
        fechaReserva: esNuevo ? undefined : getDateISOString(reservaData?.reserva.fechaHoraInicio as unknown as Date),
        horaInicio: esNuevo ? undefined : getTimeISOString(reservaData?.reserva.fechaHoraInicio as unknown as Date),
        horaFin: esNuevo ? undefined : getTimeISOString(reservaData?.reserva.fechaHoraFin as unknown as Date),
        observaciones: esNuevo ? "" : (reservaData?.descripcion ?? ""),
        sedeId: esNuevo ? undefined : String(reservaData?.sedeId),
      });
    }
  }, [esNuevo, formHook, reservaData, reservaId, tipo]);

  const [requiereInstrumental, setRequiereInstrumental] = useState<boolean>(false); // Nuevo
  useEffect(() => {
    if (esNuevo) {
      setValue("tipo", tipo!);
    }
  }, [esNuevo, tipo, setValue]);

  const onFormSubmit = async (formData: FormReservarLaboratorioAbiertoType) => {
    if (esNuevo) {
      crearReservaLaboratorioAbierto.mutate(formData, {
        onSuccess: () => {
          toast.success("Reserva creada con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al crear la reserva");
        },
      });

      return;
    }

    modificarReservaLaboratorioAbierto.mutate(formData, {
      onSuccess: () => {
        toast.success("Reserva actualizada con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar la reserva");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  const handleCancelReserva = () => {
    cancelarReservaLaboratorioAbierto.mutate(
      { id: reservaId! },
      {
        onSuccess: () => {
          toast.success("Reserva cancelada con éxito.");
          onCancel();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al cancelar la reserva");
        },
      },
    );
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

  const concurrentes = formHook.watch("concurrentes");

  console.log(formHook.formState.errors);

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
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 basis-1/2">
                <FormInput
                  label={"Hora de inicio"}
                  control={control}
                  name="horaInicio"
                  className="mt-2"
                  type={"time"}
                />
              </div>
              <div className="mt-4 basis-1/2">
                <FormInput label={"Hora de fin"} control={control} name="horaFin" className="mt-2" type={"time"} />
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full">
                <label htmlFor="concurrentes">¿Cuántas personas concurrirán al Laboratorio?</label>
                <Controller
                  control={control}
                  name="concurrentes"
                  render={({ field }) => (
                    <Slider
                      id="concurrentes"
                      value={[field.value]}
                      min={1}
                      max={8}
                      step={1}
                      className={"w-full"}
                      onValueChange={(value) => field.onChange(value[0] ?? 1)}
                    />
                  )}
                />
                <p className="mt-2">Cantidad de personas: {concurrentes}</p>
              </div>
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              {esTLA && (
                <div className="mt-4 w-full">
                  <SelectEspecialidadForm
                    name="especialidad"
                    label={"Especialidad"}
                    control={control}
                    className="mt-2"
                    placeholder={"Selecciona una especialidad"}
                  />
                </div>
              )}
              <div className="mt-4 w-full">
                <SelectSedeForm
                  name="sedeId"
                  label={"Sede"}
                  control={control}
                  className="mt-2"
                  placeholder={"Selecciona una sede"}
                />
              </div>
            </div>

            <div className="flex w-full flex-col justify-end gap-y-4 lg:justify-between">
              <div className="items-top flex space-x-2">
                <Checkbox
                  id="equipoRequerido"
                  name="equipoRequerido"
                  onCheckedChange={(checked) => {
                    if (checked === "indeterminate") {
                      // No hacer nada o manejar según tu lógica
                    } else {
                      setRequiereInstrumental(checked); // Aquí solo se asigna true o false
                    }
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="equipoRequerido">Requiere instumental</label>
                </div>
              </div>

              {/* TODO: Habilitar seccion solo si requiere instrumental = true */}
              {requiereInstrumental && (
                <div className="mt-4 w-full">
                  <EquipoTipoSelector onEquipoTipoChange={onEquipoTipoChange} />
                </div>
              )}

              {requiereInstrumental && (
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
              )}
            </div>

            <div className="flex w-full flex-row gap-x-4 lg:flex-row lg:justify-between">
              <div className="mt-4 w-full">
                <FormTextarea label={"Observaciones"} control={control} name="observaciones" className="mt-2 w-full" />
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
          <Button title="Cerrar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cerrar
          </Button>
          {!esNuevo && (
            <Button
              title="Cancelar Reserva"
              type="button"
              variant="default"
              color="danger"
              onClick={handleCancelReserva}
            >
              Cancelar Reserva
            </Button>
          )}
          <Button title="Guardar" type="submit" variant="default" color="primary">
            Guardar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
