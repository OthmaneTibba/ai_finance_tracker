import {
  ArrowLeftRight,
  Coins,
  LayoutDashboard,
  ReceiptText,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SidebarNavigation() {
  const location = useLocation();
  const pathname = location.pathname;
  const selectedClass =
    "w-[40px] text-black flex justify-center items-center h-[40px]  bg-gray-100 border  rounded-lg";
  const unSelectedClass =
    "w-[40px] text-black flex justify-center items-center h-[40px]   rounded-lg";

  return (
    <div className="fixed  left-0 top-0 bottom-0 w-[65px] shadow border-r">
      <div className="py-4 flex flex-col items-center cursor-pointer">
        <div className="w-[45px] text-white flex justify-center items-center h-[45px] bg-black rounded-full">
          <Coins className="ease-in-out scale-100 hover:scale-105" />
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <Link
            to={"/dashboard"}
            className={
              pathname == "/dashboard" ? selectedClass : unSelectedClass
            }
          >
            <LayoutDashboard className="ease-in-out scale-100 hover:scale-105" />
          </Link>

          <Link
            to={"/dashboard/receipt"}
            className={
              pathname == "/dashboard/receipt" ? selectedClass : unSelectedClass
            }
          >
            <ReceiptText className="ease-in-out scale-100 hover:scale-105" />
          </Link>

          <Link
            to={"/dashboard/transactions"}
            className={
              pathname == "/dashboard/transactions"
                ? selectedClass
                : unSelectedClass
            }
          >
            <ArrowLeftRight className="ease-in-out scale-100 hover:scale-105" />
          </Link>
        </div>
      </div>
    </div>
  );
}
