import { BibliotecaNewLibro } from "./biblioteca-new-book";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BIBLIOTECA_ROUTE } from "@/shared/server-routes";

const rutaBiblioteca = BIBLIOTECA_ROUTE.subRutas[1];

export const ActionRedirect = () => {
  return (
    <>
      <BibliotecaNewLibro />
      <Button color={"ghost"}>
        <Link href={rutaBiblioteca?.href ?? "/"} passHref>
          Ir a préstamos
        </Link>
      </Button>
    </>
  );
};
