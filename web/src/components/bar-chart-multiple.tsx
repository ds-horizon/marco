'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './ui/chart';
const DchartData = [
  { itr: '1', native_bottom_tab: 186, js_bottom_tab: 80, wix_bottom_tab: 100 },
  { itr: '2', native_bottom_tab: 305, js_bottom_tab: 200, wix_bottom_tab: 100 },
  { itr: '3', native_bottom_tab: 237, js_bottom_tab: 120, wix_bottom_tab: 100 },
  { itr: '4', native_bottom_tab: 73, js_bottom_tab: 190, wix_bottom_tab: 100 },
  { itr: '5', native_bottom_tab: 209, js_bottom_tab: 130, wix_bottom_tab: 100 },
  { itr: '6', native_bottom_tab: 214, js_bottom_tab: 140, wix_bottom_tab: 100 },
  { itr: '7', native_bottom_tab: 214, js_bottom_tab: 140, wix_bottom_tab: 100 },
  { itr: '8', native_bottom_tab: 214, js_bottom_tab: 140, wix_bottom_tab: 100 },
  { itr: '9', native_bottom_tab: 214, js_bottom_tab: 140, wix_bottom_tab: 100 },
  {
    itr: '10',
    native_bottom_tab: 214,
    js_bottom_tab: 140,
    wix_bottom_tab: 100,
  },
  {
    itr: '11',
    native_bottom_tab: 214,
    js_bottom_tab: 140,
    wix_bottom_tab: 100,
  },
  {
    itr: '12',
    native_bottom_tab: 214,
    js_bottom_tab: 140,
    wix_bottom_tab: 100,
  },
];

const DchartConfig = {
  native_bottom_tab: {
    label: 'Native Bottom Tab',
    color: 'hsl(var(--chart-1))',
  },
  js_bottom_tab: {
    label: 'JS Bottom Tab',
    color: 'hsl(var(--chart-2))',
  },
  wix_bottom_tab: {
    label: 'Wix Bottom Tab',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function BarChartMultiple({
  chartConfig,
  chartData,
}: {
  chartConfig: any;
  chartData: any;
}) {
  let description = '';
  const numberOfComparison = Object.keys(chartConfig).length;
  Object.keys(chartConfig).forEach((key, index) => {
    if (index === numberOfComparison - 1) {
      description += key;
    } else {
      description = key + ' vs ';
    }
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison Panel</CardTitle>
        <CardDescription>{description}</CardDescription>
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
            <ChartLegend
              content={<ChartLegendContent className="flex-wrap" />}
            />
            {Object.keys(chartConfig).map((key) => {
              return <Bar dataKey={key} fill={chartConfig[key].color} />;
            })}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
