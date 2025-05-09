import { Outlet } from "react-router";

import { Header } from "@/components/header";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased overflow-x-hidden">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-8 pt-6 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
