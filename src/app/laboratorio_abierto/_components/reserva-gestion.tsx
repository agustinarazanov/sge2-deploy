import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormAutocomplete, Label } from "@/components/ui";
import { MultiSelectSearch } from "@/app/laboratorio_abierto/_components/multiselect-check";

const aprobarReservaSchema = z.object({
  id: z.number().positive().min(1, { message: "Requerido" }),
  tutorId: z.string().optional(),
  inventarioRevisado: z.array(z.string()),
  laboratorioId: z.string().min(1, "Seleccione un laboratorio"),
});

type AprobarReservaFormData = z.infer<typeof aprobarReservaSchema>;

interface ReservaAprobacionProps {
  id: number;
  tutores: Array<{ id: string; name: string }>;
  laboratorios: Array<{ id: number; nombre: string }>;
  inventario: Array<{ id: string; name: string }>;
  onSubmit: (data: AprobarReservaFormData) => Promise<void>;
  onRechazar: () => Promise<void>;
  onCancel: () => void;
  isAprobando: boolean;
}

export const ReservaAprobacion: React.FC<ReservaAprobacionProps> = ({
  id,
  tutores,
  laboratorios,
  inventario,
  onSubmit,
  onRechazar,
  onCancel,
  isAprobando,
}) => {
  const formHook = useForm<AprobarReservaFormData>({
    resolver: zodResolver(aprobarReservaSchema),
    defaultValues: {
      id,
      tutorId: "",
      inventarioRevisado: [],
      laboratorioId: "",
    },
  });

  const { handleSubmit, control, watch, setValue } = formHook;

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

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Campos para Aprobación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tutorId">Tutor (Opcional)</Label>
              <Controller
                name="tutorId"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    items={tutores.map((tutor) => ({ label: tutor.name, value: tutor.id }))}
                    onQueryChange={() => {}}
                    placeholder="Buscar por nombre de tutor"
                    clearable
                    debounceTime={0}
                    {...field}
                  />
                )}
              />
            </div>

            <div>
              <Label htmlFor="laboratorioId">Laboratorio</Label>
              <Controller
                name="laboratorioId"
                control={control}
                render={({ field }) => (
                  <FormAutocomplete
                    items={laboratorios.map((lab) => ({ label: lab.nombre, value: lab.id.toString() }))}
                    onQueryChange={() => {}}
                    placeholder="Buscar por nombre de laboratorio"
                    clearable
                    debounceTime={0}
                    {...field}
                  />
                )}
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

        <div className="flex justify-end space-x-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button title="Rechazar" type="button" variant="default" color="danger" onClick={onRechazar}>
            Rechazar
          </Button>
          <Button title="Aprobar" type="submit" variant="default" color="primary" disabled={isAprobando}>
            {isAprobando ? "Aprobando..." : "Aprobar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
