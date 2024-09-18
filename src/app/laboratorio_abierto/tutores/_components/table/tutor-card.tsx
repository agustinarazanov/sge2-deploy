import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type TutorType } from "./constants";
import { cn } from "@/components/utils";
import Image from "next/image";

type CardProps = React.ComponentProps<typeof Card>;
type TutorData = {
  tutor: TutorType;
};

export function TutorCard({ className, ...props }: CardProps & TutorData) {
  const { tutor } = props;
  const { nombre, apellido, email, image } = tutor.usuario;

  return (
    <Card
      className={cn(
        "flex flex-col justify-between text-center hover:border-primary/50 hover:bg-[#75757533]/[.2]",
        className,
      )}
      {...props}
    >
      <CardHeader>
        <div className="w-full">
          <Image
            src={image ?? ""}
            alt="Imagen de tutor"
            className="rounded-lg"
            blurDataURL=""
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
            width={500}
            height={300}
          />
        </div>

        <CardTitle className="py-4">
          {nombre} {apellido}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-left">
          <CardDescription>
            <span className="font-bold">Nombre:</span> {nombre} {apellido}
          </CardDescription>
          <CardDescription>
            <span className="font-bold">Días y horarios:</span> {tutor.diasHorarios}
          </CardDescription>
          <CardDescription>
            <span className="font-bold">Sede:</span> {tutor.sede}
          </CardDescription>
          <CardDescription>
            <span className="font-bold">Especialidad:</span> {tutor.especialidad}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
