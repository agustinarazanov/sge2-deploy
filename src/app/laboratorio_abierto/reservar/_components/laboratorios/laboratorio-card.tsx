import { AlertCircleIcon, BellRing, CalendarIcon, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/components/utils";
import { Switch } from "@/components/ui/switch";
import { type ReservaLaboratorioAbiertoType } from "./constants";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

type CardProps = React.ComponentProps<typeof Card>;

type LaboratorioAbiertoType = {
  laboratorio: ReservaLaboratorioAbiertoType;
};

export function LaboratorioCard({ className, ...props }: CardProps & LaboratorioAbiertoType) {
  const { laboratorio } = props;
  const { titulo, descripcion, alerta } = laboratorio ?? {};

  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        {descripcion.map((descripcion, index) => (
          <CardDescription key={index}>{descripcion}</CardDescription>
        ))}
      </CardHeader>
      <CardContent className="grid gap-4">
        {alerta && <AlertaLaboratorio alerta={alerta} />}
        <div>
          {notifications.map((notification, index) => (
            <div key={index} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
              <span className="bg-sky-500 flex h-2 w-2 translate-y-1 rounded-full" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <CalendarIcon className="mr-2 h-4 w-4" /> Reservar
        </Button>
      </CardFooter>
    </Card>
  );
}

const AlertaLaboratorio = ({ alerta }: { alerta: string }) => {
  return (
    <div className=" flex items-center space-x-4 rounded-md border p-4">
      <AlertCircleIcon />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none underline">Importante</p>
        <p className="text-sm text-muted-foreground">{alerta}</p>
      </div>
    </div>
  );
};
