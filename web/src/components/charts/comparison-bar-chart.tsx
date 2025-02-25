'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';
import { IComparisonBarCharConfig, IComparisonBarChartData } from '~/data';
import { cn } from '~/utils/cn';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { DataTable } from '../analytics-card/data-table';
import { comaprisonMetricColumns, ComaprisonMetricData } from '~/utils/helpers';
import { calculateMetrics } from '~/utils/data';

export function ComparisonBarChart({
  chartConfig,
  chartData,
  hideComparisonPanel,
  metrics,
}: {
  chartConfig: IComparisonBarCharConfig;
  chartData: IComparisonBarChartData;
  hideComparisonPanel: () => void;
  metrics: Record<
    string,
    {
      diff: number[];
      tags: string[];
    }
  >;
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

  const stats: ComaprisonMetricData<string>[] = [];
  Object.keys(metrics).forEach((key) => {
    const { mean, std, errorRate } = calculateMetrics(metrics[key].diff);

    stats.push({
      mean: mean.toFixed(1),
      standard_deviation: std.toFixed(2),
      error_rate: errorRate.toFixed(2),
      start_event: metrics[key].tags.length > 1 ? metrics[key].tags[0] : '',
      end_event: metrics[key].tags.length > 1 ? metrics[key].tags[1] : '',
      report: key,
    });
  });

  return (
    <Card>
      <CardHeader className={cn('flex-row', 'justify-between', 'items-center')}>
        <CardTitle>{description}</CardTitle>
        <Button onClick={hideComparisonPanel} variant={'ghost'}>
          <X strokeWidth={2} />
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className={cn('min-h-[200px]', 'h-[60vh]', 'w-full')}
        >
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

      <CardContent>
        <DataTable columns={comaprisonMetricColumns} data={stats} />
      </CardContent>
    </Card>
  );
}
