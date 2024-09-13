import { type RouterOutputs } from "@/trpc/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import cn from "classnames";
import { Label } from "@/components/ui";
import { Badge } from "@/components/ui/badge";

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
  } = usuarioData;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Card
        className={cn("flex flex-col justify-between text-center hover:border-primary/50 hover:bg-[#75757533]/[.2]")}
      >
        <CardHeader>
          <CardTitle className="py-4">
            {nombre} - {legajo}{" "}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="text-left" />
          <Label>Nombre: {nombre}</Label>
          <Label>Apellido: {apellido}</Label>
          <Label>Legajo: {legajo}</Label>
          <Label>Correo: {email}</Label>
          <Label>Telefono Casa: {telefonoCasa}</Label>
          <Label>Telefono Celular: {telefonoCelular}</Label>
          <Label>Telefono Laboral: {telefonoLaboral}</Label>
          <Label>Direccion: {direccion}</Label>
          <Label>Documento: {documentoNumero}</Label>
          <Label>Sexo: {sexo}</Label>
          <Label>Fecha de Nacimiento: {fechaNacimiento?.toLocaleDateString("es-ES")}</Label>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {/* map all roles un usuario rol */}
          {usuarioRol.map((rol) => {
            return (
              <Badge key={rol.rolId} color="aqua">
                {rol.rol.nombre}
              </Badge>
            );
          })}
        </CardFooter>
      </Card>
    </div>
  );
}

export default DetalleUsuario;
