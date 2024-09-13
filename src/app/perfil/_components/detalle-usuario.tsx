import { type RouterOutputs } from "@/trpc/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import cn from "classnames";
import { Label } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type UsuarioData = RouterOutputs["admin"]["usuarios"]["getUsuarioPorId"];
type DetalleContenedor = {
  usuarioData: UsuarioData;
};

function DetalleUsuario({ usuarioData }: DetalleContenedor) {
  if (!usuarioData) {
    return <div>Usuario no encontrado</div>;
  }

  const {
    nombre,
    legajo,
    apellido,
    email,
    direccion,
    telefonoCasa,
    telefonoCelular,
    telefonoLaboral,
    documentoNumero,
    sexo,
    fechaNacimiento,
    usuarioRol,
    image,
  } = usuarioData;

  return (
    <Card className="mx-auto w-full max-w-6xl rounded-lg p-6 shadow-md">
      <CardHeader className="flex items-start space-x-6">
        {/* Imagen del usuario */}
        <div className="w-full">
          <Image
            src={image ?? ""}
            alt="Imagen de tutor"
            className="rounded-lg"
            blurDataURL=""
            sizes="100vw"
            style={{
              width: "20%",
              height: "auto",
            }}
            width={500}
            height={300}
          />
        </div>
        {/* Información del usuario */}
        <div className="flex flex-col">
          <CardTitle className="text-2xl font-semibold">
            {nombre} {apellido}
          </CardTitle>
          <p className="text-sm">Legajo: {legajo}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {usuarioRol.map((rol) => (
              <Badge key={rol.rolId}>{rol.rol.nombre}</Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      {/* Información adicional del usuario */}
      <CardContent className="mt-6 space-y-4 border-t pt-4">
        <div className="space-y-2">
          <Label className="font-semibold ">Correo</Label>
          <p>{email}</p>
        </div>
        <div className="space-y-2 border-t pt-4">
          <Label className="font-semibold ">Teléfono (Casa)</Label>
          <p>{telefonoCasa}</p>
        </div>
        <div className="space-y-2 border-t pt-4">
          <Label className="font-semibold ">Teléfono (Celular)</Label>
          <p>{telefonoCelular}</p>
        </div>
        <div className="space-y-2 border-t pt-4">
          <Label className="font-semibold ">Teléfono (Laboral)</Label>
          <p>{telefonoLaboral}</p>
        </div>
        <div className="space-y-2 border-t pt-4">
          <Label className="font-semibold ">Dirección</Label>
          <p>{direccion}</p>
        </div>
        <div className="space-y-2 border-t pt-4">
          <Label className="font-semibold ">Documento</Label>
          <p>{documentoNumero}</p>
        </div>
        <div className="space-y-2 border-t pt-4">
          <Label className="font-semibold ">Sexo</Label>
          <p>{sexo}</p>
        </div>
        <div className="space-y-2 border-t pt-4">
          <Label className="font-semibold ">Fecha de Nacimiento</Label>
          <p>{fechaNacimiento?.toLocaleDateString("es-ES")}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default DetalleUsuario;
