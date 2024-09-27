import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReservaDetalle } from "@/app/laboratorio_abierto/_components/info-basica-reserva";
import { ReservaAprobacion } from "@/app/laboratorio_abierto/_components/reserva-gestion";

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

const mockTutores = [
  { id: "tutor1", name: "Juan Pérez" },
  { id: "tutor2", name: "María González" },
  { id: "tutor3", name: "Carlos Rodríguez" },
];

const mockLaboratorios = [
  { id: 1, nombre: "Laboratorio A" },
  { id: 2, nombre: "Laboratorio B" },
  { id: 3, nombre: "Laboratorio C" },
];

const mockInventario = [
  { id: "item1", name: "Osciloscopio" },
  { id: "item2", name: "Multímetro" },
  { id: "item3", name: "Fuente de alimentación" },
  { id: "item4", name: "Protoboard" },
  { id: "item5", name: "Kit de resistencias" },
];

interface ReservaViewAdminProps {
  id: number;
  onCancel: () => void;
}

export const ReservaViewAdmin: React.FC<ReservaViewAdminProps> = ({ id, onCancel }) => {
  const router = useRouter();
  const [isAprobando, setIsAprobando] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsAprobando(true);
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Reserva aprobada:", data);
      toast.success("Reserva aprobada con éxito");
      router.refresh();
      onCancel();
    } catch (error) {
      toast.error("Error al aprobar la reserva");
    } finally {
      setIsAprobando(false);
    }
  };

  const handleRechazar = async () => {
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Reserva rechazada:", id);
      toast.success("Reserva rechazada con éxito");
      router.refresh();
      onCancel();
    } catch (error) {
      toast.error("Error al rechazar la reserva");
    }
  };

  return (
    <ScrollArea className="max-h-[calc(100vh_-_10%)]">
      <div className="container mx-auto space-y-8 p-4">
        <ReservaDetalle reserva={mockReserva} laboratorios={mockLaboratorios} />
        <ReservaAprobacion
          id={id}
          tutores={mockTutores}
          laboratorios={mockLaboratorios}
          inventario={mockInventario}
          onSubmit={handleSubmit}
          onRechazar={handleRechazar}
          onCancel={onCancel}
          isAprobando={isAprobando}
        />
      </div>
    </ScrollArea>
  );
};
