import { useForm } from "react-hook-form";
import { type RouterOutputs, api } from "@/trpc/react";
import { Button, ScrollArea } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { AyudantesSelector } from "./ayudantes-selector";

type AyudanteType = RouterOutputs["admin"]["usuarios"]["getAll"]["usuarios"][number];

const ayudantesSchema = z.object({
  ayudantes: z.array(z.string()),
});

type AyudantesSelectorProps = {
  initialAyudantes?: string[];
  cursoId: number;
  onChange: (ayudantes: string[]) => void;
};

export const AyudantesSelectorComponent = ({ initialAyudantes = [], onChange, cursoId }: AyudantesSelectorProps) => {
  const [ayudantesDiccionario, setAyudantesDiccionario] = useState<Record<string, AyudanteType>>({});

  const { data: ayudantesData } = api.admin.usuarios.getAll.useQuery({ rol: "3" });

  const { setValue, watch } = useForm({
    defaultValues: {
      ayudantes: initialAyudantes,
    },
    resolver: zodResolver(ayudantesSchema),
  });

  const currentAyudantes = watch("ayudantes");

  useEffect(() => {
    if (ayudantesData?.usuarios) {
      const newAyudantes: Record<string, AyudanteType> = {};
      ayudantesData.usuarios.forEach((ayudante) => {
        newAyudantes[ayudante.id] = ayudante;
      });
      setAyudantesDiccionario(newAyudantes);
    }
  }, [ayudantesData]);

  useEffect(() => {
    onChange(currentAyudantes);
  }, [currentAyudantes, onChange]);

  const onAyudanteChange = (ayudanteId: string) => {
    if (currentAyudantes.includes(ayudanteId)) {
      return;
    }
    setValue("ayudantes", [...currentAyudantes, ayudanteId]);
  };

  const onAyudanteDelete = (id: string) => {
    setValue(
      "ayudantes",
      currentAyudantes.filter((ayudanteId) => ayudanteId !== id),
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="w-full">
        <AyudantesSelector cursoId={cursoId} onAyudanteChange={onAyudanteChange} label="Seleccionar Ayudantes" />
      </div>

      <ScrollArea className="max-h-80 w-full pr-4">
        <div className="grid w-full grid-cols-2 gap-2">
          {currentAyudantes.map((ayudanteId) => (
            <Badge
              key={ayudanteId}
              label={`${ayudantesDiccionario[ayudanteId]?.apellido} ${ayudantesDiccionario[ayudanteId]?.nombre}`}
              variant="default"
              color="aqua"
              className="cursor-pointer justify-between text-sm"
              onClick={() => onAyudanteDelete(ayudanteId)}
              title={`Eliminar ${ayudantesDiccionario[ayudanteId]?.apellido} ${ayudantesDiccionario[ayudanteId]?.nombre}`}
            >
              <Button
                title="Eliminar"
                type="button"
                variant="icon"
                icon={XIcon}
                size="sm"
                color="ghost"
                className="rounded-full border-none hover:bg-[transparent]"
              />
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
