import { ChartConfig } from './ui/chart';
import { cn } from '~/utils/cn';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { useMemo } from 'react';
import { PerformanceData, ReportType } from '~/data-multiple';
import { calculateMetrics, findPatterns } from '~/utils/data';
import { metricColumns, MetricData } from '~/utils/helpers';
import { DataTable } from './data-table';
import { StackedBarChart } from './stacked-bar-chart';
import { RawDataAccordion } from './raw-data-accordian';

interface StackedBarChartProps {
  data: PerformanceData;
  uniqueTagsWithCount: {
    [key: string]: {
      count: number;
      color: string;
    };
  };
  tags: string[];
  reportInfo: ReportType;
}

export const DataContainer = ({
  data,
  tags,
  uniqueTagsWithCount,
  reportInfo,
}: StackedBarChartProps) => {
  const config = useMemo<ChartConfig>(
    () =>
      tags.reduce(
        (acc, tag) => ({
          ...acc,
          [tag]: {
            label: tag,
          },
        }),
        {}
      ),
    [tags]
  );

  const { formattedData, metrics } = useMemo(() => {
    const pattern = findPatterns(data, tags);
    const patternValues = Object.values(pattern);
    const max = patternValues.length
      ? Math.min(...Object.values(pattern).map((p) => p.length))
      : 0;

    const formattedData = Array.from({ length: max }).map<
      Record<string, number> & {
        itr: number;
        total: number;
      }
    >((_, index) => ({
      itr: index + 1,
      ...tags.reduce(
        (acc, tag, i) => {
          const current =
            i > 0 ? pattern[tag][index] - pattern[tags[i - 1]][index] : 0;
          return {
            ...acc,
            [tag]: current,
            total: acc.total + current,
          };
        },
        {
          total: 0,
        }
      ),
    }));

    const metrics: MetricData<string>[] = [];

    tags.forEach((tag, i) => {
      if (i > 0) {
        const d = formattedData.reduce<number[]>((acc, obj) => {
          acc.push(obj[tag]);
          return acc;
        }, []);
        const { mean, std, errorRate } = calculateMetrics(d);
        metrics.push({
          mean: mean.toFixed(1),
          standard_deviation: std.toFixed(2),
          error_rate: errorRate.toFixed(2),
          start_event: tags[i - 1],
          end_event: tags[i],
        });
      }
    });

    return {
      formattedData,
      metrics,
    };
  }, [data, tags]);

  return (
    <Card className={cn('w-200')}>
      <CardHeader>
        <CardTitle>{reportInfo.reportName}</CardTitle>
        <CardDescription>{''}</CardDescription>
      </CardHeader>
      <CardContent>
        <StackedBarChart
          formattedData={formattedData}
          tags={tags}
          uniqueTagsWithCount={uniqueTagsWithCount}
          config={config}
        />
      </CardContent>

      <CardContent>
        <DataTable columns={metricColumns} data={metrics} />
      </CardContent>

      <CardContent>
        <RawDataAccordion formattedData={formattedData} />
      </CardContent>
    </Card>
  );
};
