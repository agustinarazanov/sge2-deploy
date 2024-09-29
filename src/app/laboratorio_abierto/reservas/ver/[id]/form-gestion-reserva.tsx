import { ScrollArea } from "@/components/ui/scroll-area";
import { ReservaDetalle } from "@/app/laboratorio_abierto/_components/info-basica-reserva";
import { ReservaAprobacion } from "@/app/laboratorio_abierto/_components/reserva-gestion";

interface ReservaViewAdminProps {
  reservaId: number;
  onCancel: () => void;
}

export const ReservaViewAdmin = ({ reservaId, onCancel }: ReservaViewAdminProps) => {
  return (
    <ScrollArea className="max-h-[calc(100vh_-_10%)]">
      <div className="container mx-auto space-y-8 p-4">
        <ReservaDetalle reservaId={reservaId} />
        <ReservaAprobacion reservaId={reservaId} onCancel={onCancel} onAprobar={onCancel} />
      </div>
    </ScrollArea>
  );
};
