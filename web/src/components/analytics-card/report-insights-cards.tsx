import { ChartConfig } from '../ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { useMemo } from 'react';
import { PerformanceData, ReportType } from '~/data';
import { calculateMetrics, findPatterns } from '~/utils/data';
import { metricColumns, MetricData } from '~/utils/helpers';
import { DataTable } from './data-table';
import { SegmentedBarChart } from '../charts/segmented-bar-chart';
import { EventTimelineAccordion } from './event-timeline-accordian';

interface ReportInsightsCardProps {
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

export const ReportInsightsCard = ({
  data,
  tags,
  uniqueTagsWithCount,
  reportInfo,
}: ReportInsightsCardProps) => {
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

  return tags.length < 2 ? (
    <div className="text-center text-muted-foreground py-8">
      Select at least two events from the report to view insights.
    </div>
  ) : (
    <Card className="w-full max-w-[1400px] mx-auto overflow-x-hidden">
      <CardHeader>
        <CardTitle>{reportInfo.reportName}</CardTitle>
        <CardDescription>{''}</CardDescription>
      </CardHeader>
      <CardContent>
        <SegmentedBarChart
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
        <EventTimelineAccordion formattedData={formattedData} />
      </CardContent>
    </Card>
  );
};
