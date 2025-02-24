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
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './ui/chart';
import { IComparisonBarCharConfig, IComparisonBarChartData } from '~/data-multiple';
import { cn } from '~/utils/cn';

export function BarChartMultiple({
  chartConfig,
  chartData,
}: {
  chartConfig: IComparisonBarCharConfig;
  chartData: IComparisonBarChartData;
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
        <ChartContainer config={chartConfig} className={cn('min-h-[200px]', 'h-[60vh]', 'w-full')}>
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
