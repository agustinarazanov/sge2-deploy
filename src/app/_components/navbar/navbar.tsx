import Image from "next/image";
import Notifications from "./notifications";
import UserIcon from "./userIcon";
import MobileLinksControls from "./mobileLinksControls";
import NavbarViewLinks from "./navbarViewLinks";

import { getServerAuthSession } from "@/server/auth";

export default async function Navbar() {
  const session = await getServerAuthSession();

  const user = session?.user;

  const isLogged = user !== undefined;

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Left side of the navbar - Mobile Links Controls (only mobile) */}
          <MobileLinksControls />

          {/* Middle side of the navbar - UTN Logo & Links (only mobile) */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* UTN Logo */}
            <div className="flex flex-shrink-0">
              <div className="h-8 w-8">
                <Image
                  src={"utn-logo.svg"}
                  alt={"Logo UTN"}
                  width={40}
                  height={40}
                  className="text-white"
                />
              </div>
            </div>

            {/* Links (only desktop) */}
            <div className="hidden sm:ml-6 sm:block">
              <NavbarViewLinks user={user} isMobile={false} />
            </div>
          </div>

          {/* Right side of the navbar - Notifications & User Icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isLogged && <Notifications />}

            {isLogged && <UserIcon />}
          </div>
        </div>

        {/* Links (only mobile) */}
        <div className="sm:hidden" id="mobile-menu">
          <NavbarViewLinks user={user} isMobile={true} />
        </div>
      </div>
    </nav>
  );
}
