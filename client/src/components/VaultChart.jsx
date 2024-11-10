"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function VaultChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchData = async () => {
      try {
        const response = await fetch("/api/vaults/dashboard-stats"); // Adjust API path as necessary
        const data = await response.json();

        // Convert the daily vault data for chart
        const formattedData = data.vaultsByDay.map((item) => ({
          date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}-${String(item._id.day).padStart(2, "0")}`,
          vaultCount: item.count,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const chartConfig = {
    vaultCount: {
      label: "Vaults",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Vaults</CardTitle>
        <CardDescription>
          Showing total vaults created daily since account creation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[25rem] w-full" config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillVaults" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-vaultCount)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-vaultCount)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="vaultCount"
              type="natural"
              fill="url(#fillVaults)"
              fillOpacity={0.4}
              stroke="var(--color-vaultCount)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
