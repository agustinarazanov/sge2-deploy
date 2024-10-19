import Image from "next/image";
import { getServerAuthSession } from "@/server/auth";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems } from "@headlessui/react";
import { AlignJustify, X } from "lucide-react";
import { DesktopNavigation, ProfileMenuItem } from "./desktop";
import { MobileNavigation, MobileNotificationButton, ProfilePanel } from "./mobile";
import type { Session } from "next-auth";
import Notifications from "./notifications";
import { USER_ROUTES } from "@/shared/server-routes";

const UserIcon = ({ image, size }: { image: string | undefined | null; size: number }) => (
  <Image alt="" src={image ?? "/default-avatar.svg"} width={size} height={size} className="rounded-full" />
);

const UTNLogo = () => <Image src={"/utn-logo.svg"} alt={"Logo UTN"} width={32} height={32} />;

const MobileMenuButton = () => (
  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
    <span className="absolute -inset-0.5" />
    <span className="sr-only">Open main menu</span>
    <AlignJustify aria-hidden="true" strokeWidth={2} className="block h-8 w-8 group-data-[open]:hidden" />
    <X aria-hidden="true" className="hidden h-8 w-8 group-data-[open]:block" />
  </DisclosureButton>
);

const DesktopProfileMenu = (user: Session["user"]) => (
  <Menu as="div" className="relative ml-3">
    <div>
      <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="absolute -inset-1.5" />
        <span className="sr-only">Open user menu</span>
        <UserIcon image={user.image} size={32} />
      </MenuButton>
    </div>
    <MenuItems
      transition
      className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
    >
      <div className="py-1">
        <ProfileMenuItem key={user.id} href="#" label={`Sesión iniciada como ${user.email}`} />
      </div>
      <div className="py-1">
        {USER_ROUTES(user.id).map((item) => (
          <ProfileMenuItem key={item.href} href={item.href} label={item.label} />
        ))}
      </div>
    </MenuItems>
  </Menu>
);

const MobileProfileMenu = (user: Session["user"]) => (
  <div className="border-t border-slate-200 pb-3 pt-4">
    <div className="flex items-center px-5">
      <div className="flex-shrink-0">
        <UserIcon image={user.image} size={40} />
      </div>
      <div className="ml-3 space-y-1">
        <div className="text-base font-medium leading-none">{user.name}</div>
        <div className="text-sm font-medium leading-none text-gray-100">{user.email}</div>
      </div>
      <MobileNotificationButton />
    </div>
    <div className="mt-3 space-y-1 px-2">
      <ProfilePanel id={user.id} />
    </div>
  </div>
);

export default async function Navbar() {
  const session = await getServerAuthSession();
  const user = session?.user;
  const isLogged = user !== undefined;
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="border-b border-slate-200">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UTNLogo />
                </div>
              </div>
              <div className="hidden flex-grow justify-center md:flex">
                <DesktopNavigation isLogged={isLogged} />
              </div>
              <div className="hidden items-center space-x-4 lg:flex">
                {/* {isLogged && <DesktopNotificationButton />} */}
                {isLogged && <Notifications />}
                {isLogged && <DesktopProfileMenu {...user} />}
              </div>
              <div className="-mr-2 flex lg:hidden">
                <MobileMenuButton />
              </div>
            </div>
          </div>

          <DisclosurePanel className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <MobileNavigation isLogged={isLogged} />
            </div>
            {isLogged && <MobileProfileMenu {...user} />}
          </DisclosurePanel>
        </Disclosure>
      </div>
    </>
  );
}
