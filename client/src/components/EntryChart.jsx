"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useEffect, useState } from "react"

export function EntryChart() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // Fetch dashboard stats
    const fetchData = async () => {
      try {
        const response = await fetch("/api/vaults/dashboard-stats") // Adjust API path as necessary
        const data = await response.json()

        // Convert the daily entries data for chart
        const formattedData = data.entriesByDay.map((item) => ({
          date: new Date(item._id.year, item._id.month - 1, item._id.day).toLocaleDateString(
            "default",
            { month: "short", day: "numeric" }
          ),
          entries: item.count,
        }))

        setChartData(formattedData)
      } catch (error) {
        console.error("Error fetching chart data:", error)
      }
    }

    fetchData()
  }, [])

  const chartConfig = {
    entries: {
      label: "Entries",
      color: "hsl(var(--chart-1))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  }

  return (
    <Card className="mt-[0rem]">
      <CardHeader>
        <CardTitle>Total entries from all vaults</CardTitle>
        <CardDescription>All time stats by day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[15rem] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="date"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={false}
            />
            <XAxis dataKey="entries" type="number"  />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="entries"
              layout="vertical"
              fill="var(--color-entries)"
              radius={4}
            >
              <LabelList
                dataKey="date"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="entries"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
