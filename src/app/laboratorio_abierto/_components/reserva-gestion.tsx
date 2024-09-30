import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, ScrollArea, toast } from "@/components/ui";
import { SelectTutorForm } from "@/app/_components/select-tutor";
import { useEffect, useState } from "react";
import { inputAprobarReservaLaboratorioAbiertoSchema } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { type z } from "zod";
import { SelectLaboratorioForm } from "@/app/_components/select-ubicacion/select-laboratorio";
import { api } from "@/trpc/react";
import { Switch } from "@/components/ui/switch";
import { MinusIcon } from "lucide-react";
import { EquipoTipoSelector } from "@/app/laboratorios/_components/filtros/equipo-tipo-selector";
import { ReservaEstatus } from "@prisma/client";
import { AdminLaboratoriosNuevoLaboratorio } from "./alerta-rechazar";

type FormHelperType = {
  tutor: { id: string; label: string };
  laboratorio: { id: number; label: string };
};

type AprobarReservaFormData = z.infer<typeof inputAprobarReservaLaboratorioAbiertoSchema> & FormHelperType;

interface ReservaAprobacionProps {
  reservaId: number;
  onAprobar: () => void;
  onCancel: () => void;
  onRechazar: () => void;
}

export const ReservaAprobacion = ({ reservaId, onAprobar, onCancel, onRechazar }: ReservaAprobacionProps) => {
  const { isPending: estaAprobando, mutate: aprobarReserva } =
    api.reservas.reservaLaboratorioAbierto.aprobarReserva.useMutation();
  const { isPending: estaRechazando, mutate: rechazarReserva } =
    api.reservas.reservaLaboratorioAbierto.rechazarReserva.useMutation();
  const { data: todosLosEquiposTipo } = api.equipos.getAllTipos.useQuery({ tipoId: undefined });
  const { data: reservaData } = api.reservas.reservaLaboratorioAbierto.getReservaPorID.useQuery({
    id: reservaId,
  });

  const [requiereInstrumental, setRequiereInstrumental] = useState(false);

  const formHook = useForm<AprobarReservaFormData>({
    mode: "onChange",
    resolver: zodResolver(inputAprobarReservaLaboratorioAbiertoSchema),
    defaultValues: {
      id: reservaId,
      inventarioRevisado: [],
      laboratorioId: reservaData?.laboratorioId ?? undefined,
      laboratorio: {
        id: reservaData?.laboratorioId ?? undefined,
        label: reservaData?.laboratorio?.nombre ?? "",
      },
      tutorId: reservaData?.reserva.usuarioTutorId ?? undefined,
      tutor: {
        id: reservaData?.reserva.usuarioTutorId ?? undefined,
        label: `${reservaData?.reserva?.usuarioTutor?.apellido ?? ""} ${reservaData?.reserva?.usuarioTutor?.nombre ?? ""}`,
      },
      equipoRequerido: reservaData?.equipoReservado ?? [],
    },
  });

  const { handleSubmit, control, watch, setValue } = formHook;

  useEffect(() => {
    if (reservaData) {
      formHook.reset({
        id: reservaId,
        inventarioRevisado: [],
        laboratorioId: reservaData?.laboratorioId ?? undefined,
        laboratorio: {
          id: reservaData?.laboratorioId ?? undefined,
          label: reservaData?.laboratorio?.nombre ?? "",
        },
        tutorId: reservaData?.reserva.usuarioTutorId ?? undefined,
        tutor: {
          id: reservaData?.reserva.usuarioTutorId ?? undefined,
          label: `${reservaData?.reserva?.usuarioTutor?.apellido ?? ""} ${reservaData?.reserva?.usuarioTutor?.nombre ?? ""}`,
        },
        equipoRequerido: reservaData?.equipoReservado ?? [],
      });
    }
  }, [formHook, reservaData, reservaId]);

  const onSubmit = async (data: AprobarReservaFormData) => {
    aprobarReserva(data, {
      onSuccess: () => {
        toast.success("Reserva aprobada con éxito");
        onAprobar();
      },
      onError: (error) => {
        toast.error("Error al aprobar la reserva");
        console.error(error);
      },
    });
  };

  const handleRechazo = async (motivo: string) => {
    rechazarReserva(
      { id: reservaId, motivo },
      {
        onSuccess: () => {
          toast.success("Reserva rechazada con éxito");
          onRechazar();
        },
        onError: (error) => {
          toast.error("Error al rechazar la reserva");
          console.error(error);
        },
      },
    );
  };

  const [tutor, laboratorio] = watch(["tutor", "laboratorio"]);
  useEffect(() => tutor && formHook.setValue("tutorId", tutor.id), [formHook, tutor]);
  useEffect(() => laboratorio && formHook.setValue("laboratorioId", laboratorio?.id), [formHook, laboratorio]);

  useEffect(() => {
    if (reservaData) {
      const equiposReservados = reservaData.equipoReservado.map((equipo) => ({
        idTipo: equipo.equipoId.toString(),
        cantidad: equipo.cantidad,
      }));

      setValue("equipoRequerido", equiposReservados);
      setRequiereInstrumental(equiposReservados.length > 0);
    }
  }, [reservaData, setValue]);

  const onEquipoTipoDelete = (equipoTipoId: string) => {
    const equipos = formHook.getValues("equipoRequerido");

    formHook.setValue(
      "equipoRequerido",
      equipos.filter((equipo) => equipo.idTipo !== equipoTipoId),
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

  const currentEquipoTipo = formHook.watch("equipoRequerido");

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Campos para Aprobación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <SelectTutorForm
                name="tutor"
                realNameId="tutorId"
                control={control}
                className="mt-2"
                label="Tutor (Opcional)"
              />
            </div>

            <div>
              <SelectLaboratorioForm
                name="laboratorio"
                realNameId="laboratorioId"
                control={control}
                className="mt-2"
                label="Laboratorio"
                placeholder="Selecciona un laboratorio"
              />
            </div>

            <div>
              <Label htmlFor="inventarioRevisado">Revisar inventario</Label>
              <div className="mt-2">
                <div className="items-top flex space-x-2">
                  <Controller
                    name="equipoRequerido"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="equipoRequerido"
                        checked={requiereInstrumental}
                        onCheckedChange={(checked) => {
                          setRequiereInstrumental(checked);
                          if (!checked) {
                            field.onChange([]);
                          }
                        }}
                      />
                    )}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label htmlFor="equipoRequerido">Requiere instumental</label>
                  </div>
                </div>
                {requiereInstrumental && (
                  <div className="mt-4 w-full">
                    <EquipoTipoSelector onEquipoTipoChange={onEquipoTipoChange} />
                  </div>
                )}
              </div>
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
                          <Input
                            value={equipoTipo.cantidad}
                            type="number"
                            className="mt-2 grow basis-1/3"
                            onChange={(e) => {
                              const newEquipos = currentEquipoTipo.map((eq) =>
                                eq.idTipo === equipoTipo.idTipo ? { ...eq, cantidad: Number(e.target.value) } : eq,
                              );
                              formHook.setValue("equipoRequerido", newEquipos);
                            }}
                          />
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
          </CardContent>
        </Card>

        <div className="flex flex-row justify-end space-x-4">
          <Button
            title="Cancelar"
            type="button"
            variant="default"
            color="secondary"
            onClick={onCancel}
            className="w-full"
            isLoading={estaAprobando || estaRechazando}
          >
            Cancelar
          </Button>
          <AdminLaboratoriosNuevoLaboratorio estaRechazando={estaRechazando} handleRechazo={handleRechazo} />
          <Button
            title="Aprobar"
            type="submit"
            variant="default"
            color="primary"
            disabled={estaAprobando}
            isLoading={estaAprobando}
            className="w-full"
          >
            {reservaData?.reserva.estatus === ReservaEstatus.FINALIZADA ? "Modificar" : "Aprobar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
