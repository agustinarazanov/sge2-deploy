import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui";
import { SelectTutorForm } from "@/app/_components/select-tutor";
import { useEffect } from "react";
import { inputAprobarReservaLaboratorioAbiertoSchema } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { type z } from "zod";
import { SelectLaboratorioForm } from "@/app/_components/select-ubicacion/select-laboratorio";
import { api } from "@/trpc/react";
import { FormEquipoTipoSelector } from "@/app/laboratorios/_components/filtros/equipo-tipo-selector";
import { ReservaEstatus } from "@prisma/client";
import { AdminLaboratoriosNuevoLaboratorio } from "./alerta-rechazar";
import { esFechaPasada } from "@/shared/get-date";

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
  const { data: reservaData } = api.reservas.reservaLaboratorioAbierto.getReservaPorID.useQuery({
    id: reservaId,
  });

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
      equipoReservado: reservaData?.equipoReservado ?? [],
    },
  });

  const { handleSubmit, control, watch } = formHook;

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
        equipoReservado: reservaData?.equipoReservado ?? [],
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
  useEffect(() => {
    if (tutor) {
      formHook.setValue("tutorId", tutor.id);
    } else {
      formHook.setValue("tutorId", undefined);
    }
  }, [formHook, tutor]);
  useEffect(() => {
    if (laboratorio) {
      formHook.setValue("laboratorioId", laboratorio.id);
    } else {
      formHook.setValue("laboratorioId", undefined);
    }
  }, [formHook, laboratorio]);

  const estaEstatusPendiente = reservaData?.reserva.estatus === ReservaEstatus.PENDIENTE;
  const estaEstatusAprobada = reservaData?.reserva.estatus === ReservaEstatus.FINALIZADA;

  const esReservaPasada = esFechaPasada(reservaData?.reserva?.fechaHoraInicio);

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
              <FormEquipoTipoSelector name="equipoReservado" />
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
          {estaEstatusPendiente && !esReservaPasada && (
            <AdminLaboratoriosNuevoLaboratorio estaRechazando={estaRechazando} handleRechazo={handleRechazo} />
          )}
          {(estaEstatusAprobada || estaEstatusPendiente) && !esReservaPasada && (
            <Button
              title="Aprobar"
              type="submit"
              variant="default"
              color="primary"
              disabled={estaAprobando}
              isLoading={estaAprobando}
              className="w-full"
            >
              {estaEstatusAprobada ? "Modificar" : "Aprobar"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
