import Link from "next/link";
import { ADMIN_ROUTE } from "@/shared/server-routes";
import { Button } from "@/components/ui";

const adminRoute = ADMIN_ROUTE;

export const SubLinks = () => {
  if (!adminRoute.subRutas) return null;

  return (
    <>
      {adminRoute.subRutas.map((subRoute) => (
        <Button key={subRoute.href} color={"ghost"} className="flex-1 flex-grow">
          <Link key={subRoute.href} href={subRoute.href} passHref>
            {subRoute.label}
          </Link>
        </Button>
      ))}
    </>
  );
};
