import React from "react";
import { NuevaMateria } from "./materia-new-materia";
import { MATERIA_ROUTE } from "@/shared/server-routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const rutaMateria = MATERIA_ROUTE;
const correlativasRuta = rutaMateria?.subRutas?.[1];

export const ActionButtons = () => {
  return (
    <div className="relative flex w-full items-center justify-between space-y-3 md:flex-row md:justify-end md:space-x-3 md:space-y-0">
      <div className="flex space-x-2">
        <NuevaMateria />
        <Button color={"ghost"}>
          <Link href={correlativasRuta?.href ?? "/"} passHref>
            Correlativas
          </Link>
        </Button>
      </div>
    </div>
  );
};
