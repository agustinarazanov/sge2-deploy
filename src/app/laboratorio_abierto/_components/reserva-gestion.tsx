import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label, toast } from "@/components/ui";
import { MultiSelectSearch } from "@/app/laboratorio_abierto/_components/multiselect-check";
import { SelectTutorForm } from "@/app/_components/select-tutor";
import { useEffect } from "react";
import { inputAprobarReservaSchema } from "@/shared/filters/reserva-laboratorio-filter.schema";
import { type z } from "zod";
import { SelectLaboratorioForm } from "@/app/_components/select-ubicacion/select-laboratorio";
import { api } from "@/trpc/react";

type FormHelperType = {
  tutor: { id: string; label: string };
};

type AprobarReservaFormData = z.infer<typeof inputAprobarReservaSchema> & FormHelperType;

interface ReservaAprobacionProps {
  reservaId: number;
  onAprobar: () => void;
  onCancel: () => void;
}

const inventario = [
  { id: "item1", name: "Osciloscopio" },
  { id: "item2", name: "Multímetro" },
  { id: "item3", name: "Fuente de alimentación" },
  { id: "item4", name: "Protoboard" },
  { id: "item5", name: "Kit de resistencias" },
];

export const ReservaAprobacion: React.FC<ReservaAprobacionProps> = ({ reservaId, onAprobar, onCancel }) => {
  const { isPending: estaAprobando, mutate: aprobarReserva } =
    api.reservas.reservaLaboratorioAbierto.aprobarReserva.useMutation();
  const { isPending: estaRechazando, mutate: rechazarReserva } =
    api.reservas.reservaLaboratorioAbierto.rechazarReserva.useMutation();

  const formHook = useForm<AprobarReservaFormData>({
    mode: "onChange",
    resolver: zodResolver(inputAprobarReservaSchema),
    defaultValues: {
      id: reservaId,
      inventarioRevisado: [],
      laboratorioId: "",

      tutorId: "",
      tutor: {
        id: "",
        label: "",
      },
    },
  });

  const { handleSubmit, control, watch, setValue } = formHook;

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

  const handleRechazo = async () => {
    rechazarReserva(
      { id: reservaId, tutorId: "", laboratorioId: "" },
      {
        onSuccess: () => {
          toast.success("Reserva rechazada con éxito");
          onCancel();
        },
        onError: (error) => {
          toast.error("Error al rechazar la reserva");
          console.error(error);
        },
      },
    );
  };

  const handleInventarioItemSelect = (itemId: string) => {
    const currentItems = watch("inventarioRevisado");
    setValue("inventarioRevisado", [...currentItems, itemId]);
  };

  const handleInventarioItemRemove = (itemId: string) => {
    const currentItems = watch("inventarioRevisado");
    setValue(
      "inventarioRevisado",
      currentItems.filter((id) => id !== itemId),
    );
  };

  const [tutor] = watch(["tutor"]);
  useEffect(() => formHook.setValue("tutorId", tutor.id), [formHook, tutor]);

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
                name="laboratorioId"
                control={control}
                className="mt-2"
                label="Laboratorio"
                placeholder="Selecciona un laboratorio"
              />
            </div>

            <div>
              <Label htmlFor="inventarioRevisado">Inventario Revisado</Label>
              <Controller
                name="inventarioRevisado"
                control={control}
                render={({ field }) => (
                  <MultiSelectSearch
                    items={inventario}
                    selectedItems={field.value}
                    onItemSelect={handleInventarioItemSelect}
                    onItemRemove={handleInventarioItemRemove}
                    placeholder="Buscar items del inventario"
                  />
                )}
              />
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
          <Button
            title="Rechazar"
            type="button"
            variant="default"
            color="danger"
            onClick={handleRechazo}
            isLoading={estaRechazando}
            className="w-full"
          >
            {estaRechazando ? "Rechazando..." : "Rechazar"}
          </Button>
          <Button
            title="Aprobar"
            type="submit"
            variant="default"
            color="primary"
            disabled={estaAprobando}
            isLoading={estaAprobando}
            className="w-full"
          >
            {estaAprobando ? "Aprobando..." : "Aprobar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
