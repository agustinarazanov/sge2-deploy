import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, toast } from "@/components/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormAutocomplete } from "@/components/ui";
import { ReservaDetalle } from "@/app/laboratorio_abierto/_components/info-basica-reserva";

const mockReserva = {
  id: 1,
  reserva: {
    id: 1,
    estatus: "PENDIENTE",
    fechaHoraInicio: "2023-06-01T10:00:00Z",
    fechaHoraFin: "2023-06-01T12:00:00Z",
    tipo: "LABORATORIO_ABIERTO",
    usuarioSolicitoId: "user1",
    usuarioAprobadorId: "user2",
  },
  especialidad: "Electrónica",
  descripcion: "Proyecto de circuitos",
  numeroReserva: 12345,
  mailConfirmado: true,
  laboratorioId: 2,
};

const mockLaboratorios = [
  { id: 1, nombre: "Laboratorio A" },
  { id: 2, nombre: "Laboratorio B" },
  { id: 3, nombre: "Laboratorio C" },
];

interface ReservaViewUsuarioProps {
  id: number;
  onCancel: () => void;
}

export const ReservaViewUsuario: React.FC<ReservaViewUsuarioProps> = ({ id, onCancel }) => {
  const router = useRouter();
  const [isEditando, setIsEditando] = useState(false);
  const [laboratorioId, setLaboratorioId] = useState(mockReserva.laboratorioId.toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditando(true);
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Reserva actualizada:", { id, laboratorioId });
      toast.success("Reserva actualizada con éxito");
      router.refresh();
      onCancel();
    } catch (error) {
      toast.error("Error al actualizar la reserva");
    } finally {
      setIsEditando(false);
    }
  };

  const handleCancelar = async () => {
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Reserva cancelada:", id);
      toast.success("Reserva cancelada con éxito");
      router.refresh();
      onCancel();
    } catch (error) {
      toast.error("Error al cancelar la reserva");
    }
  };

  return (
    <ScrollArea className="max-h-[calc(100vh_-_10%)]">
      <div className="container mx-auto space-y-8 p-4">
        <ReservaDetalle reserva={mockReserva} laboratorios={mockLaboratorios} />
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Editar Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="laboratorioId">Laboratorio</Label>
                <FormAutocomplete
                  items={mockLaboratorios.map((lab) => ({ label: lab.nombre, value: lab.id.toString() }))}
                  onQueryChange={() => {}}
                  placeholder="Buscar por nombre de laboratorio"
                  clearable
                  debounceTime={0}
                  value={laboratorioId}
                  onChange={(value) => setLaboratorioId(value as string)}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="default" color="secondary" onClick={onCancel}>
                  Volver
                </Button>
                <Button type="button" variant="default" color="danger" onClick={handleCancelar}>
                  Cancelar Reserva
                </Button>
                <Button type="submit" variant="default" color="primary" disabled={isEditando}>
                  {isEditando ? "Actualizando..." : "Actualizar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};
