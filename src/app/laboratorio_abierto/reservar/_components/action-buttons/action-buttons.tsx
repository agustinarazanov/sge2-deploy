import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LABORATORIO_ABIERTO_ROUTE } from "@/shared/server-routes";

const rutaCurso = LABORATORIO_ABIERTO_ROUTE;
const subrutasCurso = rutaCurso?.subRutas ?? [];

export const ActionButtons = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-between space-y-2 md:flex-row-reverse md:space-x-1.5">
      <div className="relative flex w-full flex-row justify-center space-x-2 sm:basis-1/2 md:w-auto md:basis-1/3">
        {subrutasCurso.map((subRuta, index) => (
          <Link key={index} href={subRuta.href} passHref>
            <Button color={"ghost"}>{subRuta.label}</Button>
          </Link>
        ))}
      </div>

      <div className="flex w-full flex-row space-x-3 md:basis-1/2"></div>
    </div>
  );
};
