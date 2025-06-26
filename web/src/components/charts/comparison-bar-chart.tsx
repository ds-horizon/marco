'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

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
import { DataTable } from '../analytics-card/data-table';
import { comaprisonMetricColumns, ComaprisonMetricData } from '~/utils/helpers';
import { calculateMetrics } from '~/utils/data';
import { useMemo, useState } from 'react';
import { Switch } from '../ui/switch';

const ComparisonChartCard = ({
  config,
  data,
  shouldShowMeanChart,
}: {
  config: Record<
    string,
    {
      label: string;
      color: string;
    }
  >;
  data: Record<string, string | number>[];
  shouldShowMeanChart: boolean;
}) => {
  return (
    <CardContent>
      <ChartContainer
        config={config}
        className={cn('min-h-[200px]', 'h-[40vh]', 'w-full')}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical horizontal />
            {shouldShowMeanChart ? (
              <YAxis dataKey="maxHeight" tick={{ fontSize: 12 }} />
            ) : (
              <YAxis tick={{ fontSize: 12 }} />
            )}
            <XAxis
              dataKey="type"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend
              content={<ChartLegendContent className="flex-wrap" />}
            />
            {Object.keys(config).map((key) => {
              return <Bar dataKey={key} fill={config[key].color} />;
            })}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  );
};

export function ComparisonBarChart({
  chartConfig,
  chartData,
  // hideComparisonPanel,
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
      description = description + key + ' vs ';
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

  const chartDataWithMaxKey = useMemo(
    () =>
      chartData.map((data) => {
        const maxHeight = Object.entries(data).reduce(
          (max, [key, value]) =>
            key !== 'itr' ? Math.max(max, Number(value) || -Infinity) : max,
          -Infinity
        );

        return {
          ...data,
          maxHeight,
        };
      }),
    [chartData]
  );

  const [shouldShowMeanChart, setShouldShowMeanChart] = useState(false);
  const chartWithMeanData: Array<Record<string, number | string>> = [
    {
      type: 'Mean',
      maxHeight: 0,
    },
  ];
  const chartConfigWithMean: Record<
    string,
    {
      label: string;
      color: string;
    }
  > = {};

  stats.forEach((item) => {
    chartWithMeanData[0][item.report] = Number(item.mean);
    chartWithMeanData[0].maxHeight = Math.max(0, Number(item.mean));
    chartConfigWithMean[item.report] = {
      label: item.report,
      color: chartConfig[item.report].color,
    };
  });

  return (
    <Card className={cn('w-full')}>
      <CardHeader className="flex flex-col md:flex-row justify-center md:justify-between items-center text-center gap-y-2">
        <CardTitle className="text-xs md:text-base text-center">
          {description}
        </CardTitle>
        <div className="flex items-center space-x-2 justify-center">
          <span className="text-xs md:text-base">Mean Data</span>
          <Switch
            id="airplane-mode"
            checked={shouldShowMeanChart}
            onCheckedChange={setShouldShowMeanChart}
          />
          <span className="text-xs md:text-base">Iteration Data</span>
        </div>
      </CardHeader>

      {shouldShowMeanChart ? (
        <div className={'border-2'}>
          <ComparisonChartCard
            shouldShowMeanChart={shouldShowMeanChart}
            data={chartDataWithMaxKey}
            config={chartConfig}
          />
        </div>
      ) : (
        <div className={'border-2'}>
          <ComparisonChartCard
            shouldShowMeanChart={shouldShowMeanChart}
            data={chartWithMeanData}
            config={chartConfigWithMean}
          />
        </div>
      )}

      <CardContent>
        <DataTable columns={comaprisonMetricColumns} data={stats} />
      </CardContent>
    </Card>
  );
}
