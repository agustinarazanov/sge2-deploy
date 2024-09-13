import Link from "next/link";
import { EQUIPOS_ROUTE } from "@/shared/server-routes";
import { Button } from "@/components/ui";

const equiposRoute = EQUIPOS_ROUTE;

export const SubLinks = () => {
  if (!equiposRoute.subRutas) return null;

  return (
    <>
      {equiposRoute.subRutas.map((subRoute) => (
        <Button key={subRoute.href} color={"ghost"} className="flex-1 flex-grow">
          <Link key={subRoute.href} href={subRoute.href} passHref>
            {subRoute.label}
          </Link>
        </Button>
      ))}
    </>
  );
};
