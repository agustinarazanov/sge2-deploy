import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LABORATORIO_ROUTE } from "@/shared/server-routes";
import { SoftwareNuevoEditar } from "./software-nuevo";

const rutaMisCursos = LABORATORIO_ROUTE?.subRutas[0];
const rutaCatedra = LABORATORIO_ROUTE?.subRutas[1];

export const SoftwareActionRedirect = () => {
  return (
    <>
      <SoftwareNuevoEditar />
      <Button color={"ghost"}>
        <Link href={rutaMisCursos?.href ?? "/"} passHref>
          Ir a mis cursos
        </Link>
      </Button>
      <Button color={"ghost"}>
        <Link href={rutaCatedra?.href ?? "/"} passHref>
          Ir a cátedra
        </Link>
      </Button>
    </>
  );
};
