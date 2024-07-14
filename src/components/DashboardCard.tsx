import { HandCoins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function DashboardCard() {
  return (
    <Card className="md:w-[300px] w-full">
      <CardHeader>
        <CardTitle className="text-sm text-gray-600">
          Current Month Spent
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="font-extrabold text-3xl">20000</p>

          <div className="bg-black rounded-md p-3 text-white">
            <HandCoins />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
