import { AlertCircleIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/components/utils";
import { type ReservaLaboratorioAbiertoType } from "./constants";

type CardProps = React.ComponentProps<typeof Card>;

type LaboratorioAbiertoType = {
  laboratorio: ReservaLaboratorioAbiertoType;
};

export function LaboratorioCard({ className, ...props }: CardProps & LaboratorioAbiertoType) {
  const { laboratorio } = props;
  const { titulo, descripcion, alerta, contenido } = laboratorio ?? {};

  return (
    <Card className={cn("flex flex-col justify-between text-center", className)} {...props}>
      <CardHeader>
        <CardTitle className="py-4">{titulo}</CardTitle>
        {descripcion.map((descripcion, index) => (
          <CardDescription key={index}>{descripcion}</CardDescription>
        ))}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-left" dangerouslySetInnerHTML={{ __html: contenido ?? "" }} />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {alerta && <AlertaLaboratorio alerta={alerta} />}
        <Button className="w-full">
          <CalendarIcon className="mr-2 h-4 w-4" /> Reservar
        </Button>
      </CardFooter>
    </Card>
  );
}

const AlertaLaboratorio = ({ alerta }: { alerta: string }) => {
  return (
    <div className=" flex items-center space-x-4 rounded-md border border-warn p-4">
      <AlertCircleIcon />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none underline">Importante</p>
        <p className="text-sm text-muted-foreground">{alerta}</p>
      </div>
    </div>
  );
};
