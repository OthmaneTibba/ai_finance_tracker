import { useUserStore } from "../stores/user-store";

import DashboardCard from "../components/DashboardCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CalendarIcon, FileScan } from "lucide-react";
import moment from "moment";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { cn } from "../lib/utils";
import {
  getDailyExpenseAnalytics,
  getTopCategoryItemAnalytics,
} from "../services/ApiService";
import { TotalTarnsactionAnalytics } from "../models/total_transaction_analytics";
import { CategoryItemAnalytics } from "../models/category_item_analytics";

export default function Dashboard() {
  const userStore = useUserStore();
  const [dailyAnalytics, setDailyAnalytics] = useState<
    TotalTarnsactionAnalytics[]
  >([]);

  const [categoryItemAnalytics, setCategoryItemAnalytics] = useState<
    CategoryItemAnalytics[]
  >([]);

  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const [expenses, setExpenses] = useState<number>(0);

  const getDailyAnalytics = async (
    startDate: string,
    endDate: string,
    transactionType: string = "Expense"
  ) => {
    const response = await getDailyExpenseAnalytics(
      startDate,
      endDate,
      transactionType
    );

    setDailyAnalytics(response);
    setExpenses(response.reduce((acc, elm) => acc + elm.amount, 0));
  };

  const getCategoryItemsAnalytics = async (
    startDate: string,
    endDate: string,
    transactionType: string = "Expense"
  ) => {
    const data = await getTopCategoryItemAnalytics(
      startDate,
      endDate,
      transactionType
    );
    setCategoryItemAnalytics(data);
  };

  useEffect(() => {
    if (date !== undefined) {
      const startDate = moment(date.from).format("yyyy-MM-DD");
      const endDate = moment(date.to).format("yyyy-MM-DD");
      Promise.all([
        getDailyAnalytics(startDate, endDate),
        getCategoryItemsAnalytics(startDate, endDate),
      ]);
    }
  }, []);

  const onDateChanged = (e: DateRange | undefined) => {
    if (e?.from === undefined || e.to === undefined) {
      return;
    }
    setDate(e);
    const startDate = moment(e.from).format("yyyy-MM-DD");
    const endDate = moment(e.to).format("yyyy-MM-DD");
    Promise.all([
      getDailyAnalytics(startDate, endDate),
      getCategoryItemsAnalytics(startDate, endDate),
    ]);
  };

  const dailyAnalyticsChartConfig = {
    total: {
      label: "total",
      color: "hsl(var(--primary))",
    },
    amount: {
      label: "amount",
      color: "hsl(var(--primary))",
    },
  };
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--primary))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-5">
      <div className="py-2 flex flex-col md:flex-row gap-2 md:gap-0 items-center md:justify-between">
        <h1 className="font-extrabold text-2xl md:text-3xl">
          Hi {userStore.user.email} 👋
        </h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={onDateChanged}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Card className="md:w-[500px] w-full">
          <CardHeader>
            <CardTitle>Receipt Scanner</CardTitle>
            <CardDescription>
              {" "}
              Upload and scan your receipt now! track and organize your expenses
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>
              <FileScan className="mr-2 h-4 w-4" />
              Scan now
            </Button>
          </CardFooter>
        </Card>
        <DashboardCard amount={expenses} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
        <Card>
          <CardHeader>
            <CardTitle>Daily Expenses</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <ChartContainer
              config={dailyAnalyticsChartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={dailyAnalytics}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 10)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="amount" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top products categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={categoryItemAnalytics}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  hide
                />
                <XAxis dataKey="amount" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="amount"
                  layout="vertical"
                  fill="var(--color-desktop)"
                  radius={4}
                >
                  <LabelList
                    dataKey="category"
                    position="insideLeft"
                    offset={8}
                    className="fill-[--color-label]"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
