import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui";
import { useEffect } from "react";
import { inputAprobarReservaLaboratorioCerradoSchema } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { type z } from "zod";
import { SelectLaboratorioFormConEstadoReservaForm } from "@/app/_components/select-ubicacion/select-laboratorio";
import { api } from "@/trpc/react";
import { FormEquipoTipoSelector } from "@/app/laboratorios/_components/filtros/equipo-tipo-selector";
import { ReservaEstatus } from "@prisma/client";
import { AdminLaboratoriosNuevoLaboratorio } from "./alerta-rechazar";
import { esFechaPasada } from "@/shared/get-date";

type FormHelperType = {
  tutor: { id: string; label: string };
  laboratorio: { id: number; label: string };
};

type AprobarReservaFormData = z.infer<typeof inputAprobarReservaLaboratorioCerradoSchema> & FormHelperType;

interface ReservaAprobacionProps {
  reservaId: number;
  onAprobar: () => void;
  onCancel: () => void;
  onRechazar: () => void;
}

export const ReservaAprobacion = ({ reservaId, onAprobar, onCancel, onRechazar }: ReservaAprobacionProps) => {
  const { isPending: estaAprobando, mutate: aprobarReserva } =
    api.reservas.reservarLaboratorioCerrado.aprobarReserva.useMutation();
  const { isPending: estaRechazando, mutate: rechazarReserva } =
    api.reservas.reservarLaboratorioCerrado.rechazarReserva.useMutation();
  const { data: reservaData } = api.reservas.reservarLaboratorioCerrado.getReservaPorID.useQuery({
    id: reservaId,
  });

  const formHook = useForm<AprobarReservaFormData>({
    mode: "onChange",
    resolver: zodResolver(inputAprobarReservaLaboratorioCerradoSchema),
    defaultValues: {
      id: reservaId,
      inventarioRevisado: [],
      laboratorioId: reservaData?.laboratorioId ? String(reservaData?.laboratorioId) : undefined,
      laboratorio: {
        id: reservaData?.laboratorioId ?? undefined,
        label: reservaData?.laboratorio?.nombre ?? "",
      },
      equipoReservado: reservaData?.equipoReservado ?? [],
    },
  });

  const { handleSubmit, control } = formHook;

  useEffect(() => {
    if (reservaData) {
      formHook.reset({
        id: reservaId,
        inventarioRevisado: [],
        laboratorioId: reservaData?.laboratorioId ? String(reservaData?.laboratorioId) : undefined,
        laboratorio: {
          id: reservaData?.laboratorioId ?? undefined,
          label: reservaData?.laboratorio?.nombre ?? "",
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

  const estaEstatusPendiente = reservaData?.reserva.estatus === ReservaEstatus.PENDIENTE;
  const estaEstatusAprobada = reservaData?.reserva.estatus === ReservaEstatus.FINALIZADA;
  const estaCancelada = reservaData?.reserva.estatus === ReservaEstatus.CANCELADA;

  const esReservaPasada = esFechaPasada(reservaData?.reserva?.fechaHoraInicio);

  const laboratorioId = formHook.watch("laboratorioId");

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Campos para Aprobación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex w-full flex-col gap-y-4">
              <SelectLaboratorioFormConEstadoReservaForm
                name="laboratorioId"
                control={control}
                className="mt-2"
                label="Laboratorio"
                placeholder="Selecciona un laboratorio"
                sedeId={reservaData?.sedeId ? String(reservaData?.sedeId) : undefined}
                excepcionReservaId={reservaId}
                fechaHoraInicio={reservaData?.reserva?.fechaHoraInicio}
                fechaHoraFin={reservaData?.reserva?.fechaHoraFin}
                laboratorioId={laboratorioId}
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
          {(estaEstatusPendiente || estaEstatusAprobada) && !esReservaPasada && (
            <AdminLaboratoriosNuevoLaboratorio estaRechazando={estaRechazando} handleRechazo={handleRechazo} />
          )}
          {!estaCancelada && !esReservaPasada && (
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
