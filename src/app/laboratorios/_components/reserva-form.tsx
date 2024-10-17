/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, FormProvider, useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button, FormInput, Input, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useMemo } from "react";
import {
  inputEditarReservaLaboratorioCerradoSchema,
  inputReservaLaboratorioCerrado,
  inputReservaLaboratorioDiscrecional,
} from "@/shared/filters/reserva-laboratorio-filter.schema";
import { FormTextarea, Textarea } from "@/components/ui/textarea";
import { FormEquipoTipoSelector } from "./filtros/equipo-tipo-selector";
import { CursoTurno } from "@/app/_components/turno-text";
import { Switch } from "@/components/ui/switch";
import { FormInputPoliticas } from "@/app/_components/input-form-politicas";
import { esFechaPasada, getDateISOString } from "@/shared/get-date";
import { ReservaEstatus, TurnoCurso } from "@prisma/client";
import { ReservaDetalle } from "./info-basica-reserva";
import { SelectSedeForm } from "@/app/_components/select-ubicacion/select-sede";

type Props = {
  cursoId?: string;
  reservaId?: number;
  onSubmit: () => void;
  onCancel: () => void;
};
type FormReservarLaboratorioType =
  | z.infer<typeof inputEditarReservaLaboratorioCerradoSchema>
  | z.infer<typeof inputReservaLaboratorioDiscrecional>;

export const LaboratorioCerradoForm = ({ reservaId, cursoId, onSubmit, onCancel }: Props) => {
  const esNuevo = reservaId === undefined;
  const esDiscrecional = !cursoId;

  const {
    data: curso,
    isLoading,
    isError,
  } = api.cursos.cursoPorId.useQuery({ id: Number(cursoId!) }, { enabled: !esDiscrecional });
  const { data: reservaData } = api.reservas.reservarLaboratorioCerrado.getReservaPorID.useQuery(
    { id: reservaId! },
    { enabled: !esNuevo },
  );

  const crearReservaLaboratorio = api.reservas.reservarLaboratorioCerrado.crearReserva.useMutation();
  const crearReservaDiscrecional = api.reservas.reservarLaboratorioCerrado.crearReservaDiscrecional.useMutation();
  const modificarReservaLaboratorio = api.reservas.reservarLaboratorioCerrado.editarReserva.useMutation();
  const cancelarReservaLaboratorio = api.reservas.reservarLaboratorioCerrado.cancelarReserva.useMutation();

  const estaEstatusAprobada = reservaData?.reserva.estatus === ReservaEstatus.FINALIZADA;
  const estaEstatusCancelada = reservaData?.reserva.estatus === ReservaEstatus.CANCELADA;
  const haSidoRechazada = !!(
    reservaData &&
    reservaData?.reserva?.motivoRechazo &&
    reservaData.reserva.motivoRechazo.length > 0
  );

  const esReservaPasada = esFechaPasada(reservaData?.reserva?.fechaHoraInicio);

  const reservaBase = useMemo(() => {
    return {
      id: reservaId ?? undefined,
      cursoId: cursoId ? Number(cursoId) : undefined,
      aceptoTerminos: false,
      equipoReservado: esNuevo ? [] : (reservaData?.equipoReservado ?? []),
      fechaReserva: esNuevo ? undefined : getDateISOString(reservaData?.reserva.fechaHoraInicio as unknown as Date),
      requierePc: reservaData?.requierePC ?? false,
      requiereProyector: reservaData?.requiereProyector ?? false,
      turno: esNuevo ? TurnoCurso.MANANA : reservaData?.curso?.turno,
      observaciones: reservaData?.descripcion ?? "",
      esDiscrecional: esDiscrecional,
      sedeId: esDiscrecional ? String(reservaData?.sedeId) : undefined,
    } as FormReservarLaboratorioType;
  }, [cursoId, esDiscrecional, esNuevo, reservaData, reservaId]);

  const formHook = useForm<FormReservarLaboratorioType>({
    mode: "onChange",
    defaultValues: reservaBase,
    resolver: zodResolver(
      esDiscrecional
        ? inputReservaLaboratorioDiscrecional
        : esNuevo
          ? inputReservaLaboratorioCerrado
          : inputEditarReservaLaboratorioCerradoSchema,
    ),
  });

  useEffect(() => {
    formHook.reset(reservaBase);
  }, [formHook, reservaBase]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = formHook;

  useEffect(() => {
    console.log("Errores de validación:", errors);
  }, [errors]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = async (formData: FormReservarLaboratorioType) => {
    console.log("Formulario enviado con datos:", formData);
    if (esDiscrecional) {
      crearReservaDiscrecional.mutate(
        {
          ...formData,
          sedeId: String(formHook.watch("sedeId")),
          horaInicio: formHook.watch("horaInicio"),
          horaFin: formHook.watch("horaFin"),
        },
        {
          onSuccess: () => {
            toast.success("Reserva creada con éxito.");
            onSubmit();
          },
          onError: (error) => {
            toast.error(error?.message ?? "Error al crear la reserva");
          },
        },
      );
      return;
    }

    if (esNuevo) {
      crearReservaLaboratorio.mutate(
        { ...formData, cursoId: Number(cursoId) },
        {
          onSuccess: () => {
            toast.success("Reserva creada con éxito.");
            onSubmit();
          },
          onError: (error) => {
            toast.error(error?.message ?? "Error al crear la reserva");
          },
        },
      );
      return;
    }

    modificarReservaLaboratorio.mutate(
      { ...formData, id: reservaId, cursoId: Number(reservaData?.cursoId) },
      {
        onSuccess: () => {
          toast.success("Reserva modificada con éxito.");
          onSubmit();
        },
        onError: (error) => {
          toast.error(error?.message ?? "Error al modificar la reserva");
        },
      },
    );
  };

  const handleCancelReserva = () => {
    cancelarReservaLaboratorio.mutate(
      { id: reservaId!, motivo: "Cancelada por el usuario" },
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

  const caracteresEnObservaciones = formHook.watch("observaciones")?.length ?? 0;

  if (reservaId && esReservaPasada) {
    return <ReservaDetalle reservaId={reservaId} mostrarCompleto />;
  }

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
                <div className="mt-4 basis-1/2">
                  <SelectSedeForm
                    name="sedeId"
                    label={"Sede"}
                    control={control}
                    className="mt-2"
                    placeholder={"Selecciona una sede"}
                  />
                </div>
              )}
              {/* {!esDiscrecional && (
                <div className="mt-4 basis-1/2">
                  <FormSelect label={"Turno"} name="turno" className="mt-2" items={turnosValues} control={control} readonly/>
                </div>
              )} */}

              <div className="mt-4 basis-1/2">
                {/* TODO: Habilitar fecha de reserva a los días de curso */}
                <FormInput
                  label={"Fecha de reserva"}
                  control={control}
                  name="fechaReserva"
                  className="mt-2"
                  type={"date"}
                />
              </div>
            </div>

            {esDiscrecional && (
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
            )}

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
              <FormEquipoTipoSelector name="equipoReservado" />
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
                  {250 - caracteresEnObservaciones} caracteres restantes
                </small>
              </div>
            </div>

            {haSidoRechazada && (
              <div className="flex w-full flex-col justify-end gap-y-4 lg:justify-between">
                <div className="mt-4 w-full">
                  <Textarea
                    label={"Motivo de rechazo"}
                    className="max-h-10 w-full"
                    placeholder="Escribí el motivo de rechazo"
                    readOnly
                    value={reservaData?.reserva.motivoRechazo ?? ""}
                  />
                </div>
              </div>
            )}

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
          {!esNuevo && !estaEstatusCancelada && !esReservaPasada && (
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
          {!estaEstatusCancelada && !esReservaPasada && (
            <Button title="Guardar" type="submit" variant="default" color="primary">
              {estaEstatusAprobada ? "Modificar" : "Guardar"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
