import { Contact, Home, Landmark } from "lucide-react";

import { AccountMenu } from "./account-menu";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme/theme-toggle";
import { Separator } from "./ui/separator";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center md:gap-6 md:px-6 gap-4 px-8 ">
        <Landmark className="hidden sm:flex md:h-6 md:w-6" />

        <Separator orientation="vertical" className="md:h-6" />

        <nav className="flex items-center whitespace-nowrap space-x-4 md:space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/clients">
            <Contact className=" h-4 w-4 " />
            Clientes
          </NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
