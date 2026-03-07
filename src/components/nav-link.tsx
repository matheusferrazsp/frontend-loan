import { Link, LinkProps, useLocation } from "react-router";

import { cn } from "@/lib/utils";

export interface NavLinkProps extends LinkProps {}

export function NavLink(props: NavLinkProps) {
  const { pathname } = useLocation();
  const { className, ...rest } = props;

  return (
    <Link
      data-current={pathname === rest.to}
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground data-[current=true]:text-foreground",
        className,
      )}
      {...rest}
    />
  );
}
