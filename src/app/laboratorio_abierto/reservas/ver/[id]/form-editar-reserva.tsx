import { useRouter } from "next/navigation";
import { toast } from "@/components/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReservaDetalle } from "@/app/laboratorio_abierto/_components/info-basica-reserva";
import { SelectLaboratorioForm } from "@/app/_components/select-ubicacion/select-laboratorio";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputEditarReservaLaboratorioAbiertoSchema } from "@/shared/filters/reservas-filter.schema";
import { type z } from "zod";
import { api } from "@/trpc/react";

interface ReservaViewUsuarioProps {
  reservaId: number;
  onCancel: () => void;
}

type FormHelperType = z.infer<typeof inputEditarReservaLaboratorioAbiertoSchema>;

export const ReservaViewUsuario = ({ reservaId, onCancel }: ReservaViewUsuarioProps) => {
  const router = useRouter();

  const { isPending: estaEditando, mutate: editarReserva } =
    api.reservas.reservaLaboratorioAbierto.editarReserva.useMutation();

  const formHook = useForm<FormHelperType>({
    mode: "onChange",
    resolver: zodResolver(inputEditarReservaLaboratorioAbiertoSchema),
    defaultValues: {
      id: reservaId,
      laboratorioId: undefined,
    },
  });

  const onSubmit = async (data: FormHelperType) => {
    editarReserva(data, {
      onSuccess: () => {
        toast.success("Reserva actualizada con éxito");
        router.refresh();
        onCancel();
      },
      onError: (error) => {
        toast.error("Error al actualizar la reserva");
        console.error(error);
      },
    });
  };

  const handleCancelar = async () => {
    toast.success("Reserva cancelada con éxito");
    router.refresh();
    onCancel();
  };

  return (
    <ScrollArea className="max-h-[calc(100vh_-_10%)]">
      <div className="container mx-auto space-y-8 p-4">
        <ReservaDetalle reservaId={reservaId} />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Editar Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...formHook}>
              <form onSubmit={formHook.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <SelectLaboratorioForm
                    name="laboratorioId"
                    control={formHook.control}
                    className="mt-2"
                    label="Laboratorio"
                    placeholder="Selecciona un laboratorio"
                    disabled={!estaEditando}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="default" color="secondary" onClick={onCancel} disabled={estaEditando}>
                    Volver
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    color="danger"
                    onClick={handleCancelar}
                    disabled={estaEditando}
                  >
                    Cancelar Reserva
                  </Button>
                  <Button type="submit" variant="default" color="primary" isLoading={estaEditando}>
                    {estaEditando ? "Actualizando..." : "Actualizar"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};
