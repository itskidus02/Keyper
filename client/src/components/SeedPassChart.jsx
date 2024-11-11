"use client"

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function SeedPassChart() {
  const [chartData, setChartData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/vaults/dashboard-stats");
        const data = await response.json();

        // Format data for seeds and passwords
        const seedCount = data.seedsAndPasswordsByDay
          .filter((item) => item._id.type === "seed")
          .reduce((acc, curr) => acc + curr.count, 0);
        
        const passwordCount = data.seedsAndPasswordsByDay
          .filter((item) => item._id.type === "password")
          .reduce((acc, curr) => acc + curr.count, 0);

        setChartData([
          { name: "Seeds", count: seedCount, fill: "#4CAF50" },      // Green for seeds
          { name: "Passwords", count: passwordCount, fill: "#2196F3" }, // Blue for passwords
        ]);

        setTotalEntries(seedCount + passwordCount);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const chartConfig = {
    seeds: { label: "Seeds", color: "#4CAF50" },
    passwords: { label: "Passwords", color: "hsl(var(--chart-1))" },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Seed and Password Distribution</CardTitle>
        <CardDescription>Daily Counts</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalEntries.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Total Entries
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        
        <div className="leading-none text-muted-foreground">
          Showing your seed and password counts 
        </div>
      </CardFooter>
    </Card>
  );
}
