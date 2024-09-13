import Image from "next/image";

type UsuarioReserva = {
  id: string;
  nombre: string | null;
  apellido: string | null;
  legajo: string | null;
  email: string | null;
  image: string | null;
  name: string | null;
};

export const DatoUsuarioReserva = ({ usuario }: { usuario: UsuarioReserva | null }) => {
  if (!usuario) {
    return <span className="text-center">Sin información</span>;
  }

  const { nombre, name, apellido, legajo, email, image } = usuario;

  const firstName = nombre ?? name ?? "";
  const lastName = apellido ?? "";
  const fullName = `${firstName}, ${lastName}`;

  return (
    <div title={`${fullName} - ${email}`} className="flex flex-row content-center items-center space-x-2 text-center">
      <Image src={image ?? ""} alt="Imagen de perfil" width={32} height={32} className="rounded-full" />
      <span className="ml-2">{fullName}</span>
      <span className="ml-2">{legajo}</span>
    </div>
  );
};
