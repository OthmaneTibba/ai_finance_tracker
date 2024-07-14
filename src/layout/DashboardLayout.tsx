import { Outlet } from "react-router-dom";
import SidebarNavigation from "../components/SidebarNavigation";
import { Toaster } from "../components/ui/toaster";

export default function DashboardLayout() {
  return (
    <div className="w-full h-screen">
      <SidebarNavigation />

      <div className="pl-[65px] ">
        <div className="w-full h-[60px] shadow border-b"></div>
        <div className="p-5 flex flex-col">
          <Outlet />
          <Toaster />
        </div>
      </div>
    </div>
  );
}
