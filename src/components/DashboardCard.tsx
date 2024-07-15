import { HandCoins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type DashboardCardProps = {
  amount: number;
};

export default function DashboardCard({ amount }: DashboardCardProps) {
  return (
    <Card className="md:w-[300px] w-full">
      <CardHeader>
        <CardTitle className="text-sm text-gray-600">Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="font-extrabold text-3xl">{amount}</p>

          <div className="bg-black rounded-md p-3 text-white">
            <HandCoins />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
