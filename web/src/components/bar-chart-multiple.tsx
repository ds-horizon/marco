"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart"
const chartData = [
  { itr: "1", native_bottom_tab: 186, js_bottom_tab: 80, wix_bottom_tab: 100 },
  { itr: "2", native_bottom_tab: 305, js_bottom_tab: 200, wix_bottom_tab: 100 },
  { itr: "3", native_bottom_tab: 237, js_bottom_tab: 120, wix_bottom_tab: 100 },
  { itr: "4", native_bottom_tab: 73, js_bottom_tab: 190, wix_bottom_tab: 100 },
  { itr: "5", native_bottom_tab: 209, js_bottom_tab: 130, wix_bottom_tab: 100 },
  { itr: "6", native_bottom_tab: 214, js_bottom_tab: 140, wix_bottom_tab: 100 },
  { itr: "7", native_bottom_tab: 214, js_bottom_tab: 140, wix_bottom_tab: 100 },
  { itr: '8', native_bottom_tab: 214, js_bottom_tab: 140, wix_bottom_tab: 100 },
  { itr: '9', native_bottom_tab: 214, js_bottom_tab: 140, wix_bottom_tab: 100 },
  { itr: '10', native_bottom_tab: 214, js_bottom_tab: 140, wix_bottom_tab: 100 },
  { itr: '11', native_bottom_tab: 214, js_bottom_tab: 140, wix_bottom_tab: 100 },
  { itr: '12', native_bottom_tab: 214, js_bottom_tab: 140, wix_bottom_tab: 100 },
];

const chartConfig = {
  native_bottom_tab: {
    label: "Native Bottom Tab",
    color: "hsl(var(--chart-1))",
  },
  js_bottom_tab: {
    label: "JS Bottom Tab",
    color: "hsl(var(--chart-2))",
  },
  wix_bottom_tab: {
    label: "Wix Bottom Tab",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function BarChartMultiple() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison of Bottom Tabs</CardTitle>
        <CardDescription>Native vs JS vs Wix</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="itr"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="native_bottom_tab" fill="var(--color-native_bottom_tab)" radius={4} />
            <Bar dataKey="js_bottom_tab" fill="var(--color-js_bottom_tab)" radius={4} />
            <Bar dataKey="wix_bottom_tab" fill="var(--color-wix_bottom_tab)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 12 months
        </div>
      </CardFooter>
    </Card>
  )
}
