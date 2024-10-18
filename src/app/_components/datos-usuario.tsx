import { Button } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";

type UsuarioReserva = {
  id: string;
  nombre: string | null;
  apellido: string | null;
  legajo: string | null;
  email: string | null;
  image: string | null;
  name: string | null;
};

const rutaUsuario = "/perfil";

export const DatoUsuarioReserva = ({ usuario }: { usuario: UsuarioReserva | null }) => {
  if (!usuario) {
    return <span className="text-center">Sin información</span>;
  }

  const { nombre, name, apellido, legajo, email, image } = usuario;

  const firstName = nombre ?? "";
  const lastName = apellido ?? "";
  const fullName = `${firstName}, ${lastName}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button color="ghost" className="flex flex-row gap-x-2 border-none">
          <div>
            <Avatar className="h-6 w-6">
              <AvatarImage src={image ?? ""} alt={`Imagen de perfil de ${fullName}`} />
              <AvatarFallback>{fullName.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <div>{fullName}</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="py-0 pl-0">
        <div title={`${fullName} - ${email}`} className="flex flex-row space-x-2 text-center">
          <div className="basis-1/3">
            <div className="h-32 w-32">
              <Image
                src={image ?? ""}
                className="rounded-l-md"
                alt="Imagen de perfil"
                objectFit="cover"
                priority={false}
                height={160}
                width={160}
              />
            </div>
          </div>
          <div className="flex basis-2/3 flex-col justify-around text-left text-sm">
            <div>
              <div className="ml-2">
                <b>{fullName}</b>
              </div>
              <div className="ml-2">
                <code>{name}</code>
              </div>
              <div className="ml-2">
                <code>{legajo}</code>
              </div>
            </div>
            <div>
              <Link href={`${rutaUsuario}/${usuario.id}`} passHref>
                <Button variant="default" color="outline" size="sm" className="w-full">
                  Ver perfil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
