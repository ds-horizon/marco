import { cn } from '~/utils/cn';
import {
  calculateMetrics,
  findPatterns,
  tagWiseCountAndColor,
} from '~/utils/data';

import React, { useEffect, useMemo, useState } from 'react';
import { visualiseMultipleReports } from './data';
import { Header } from './header';
import { MetricData, metricColumns } from './utils/helpers';
import { DataTable } from './components/data-table';
import { CheckedState } from '@radix-ui/react-checkbox';
import { BarChartMultiple } from './components/bar-chart-multiple';
import { SideBar } from './components/sidebar';
import { StackedBarChart } from './components/stacked-bar-chart';
import { ChartConfig } from './components/ui/chart';
import { TimelineViewData } from './components/timeline-row';
import { EmptyPage } from './components/empty-page';
import { ReportType, useMultipleReportData } from './data-multiple';

const TotalItrCountCard = ({ count }: { count: number }) => {
  return (
    <h1 className="mt-12 mb-4 text-xl font-bold">
      <span className="px-2 py-1 rounded-full bg-card">{count}</span> Total
      iterations
    </h1>
  );
};

export function App() {

  const multipleEventData = useMultipleReportData();

  const uniqueTagsWithCountForMultipleReport = useMemo(
    () => multipleEventData.map((report) => tagWiseCountAndColor(report.data)),
    [multipleEventData]
  );
  const reports: ReportType[] = useMemo(() => multipleEventData.map((report) => ({
    reportKey: report.reportKey,
    reportName: report.reportName,
    reportPath: report.reportPath
  })), [multipleEventData])

  const [currentReportId, setCurrentReportId] = useState<number>(0);
  const [tagsPerReport, setTagsPerReport] = useState<string[][]>(new Array(multipleEventData.length).fill([]));

  const [multipleData, setMultipleData] = useState(null);
  const [chartConfig, setChartConfig] = useState(null);

  useEffect(() => {
    visualiseMultipleReports().then((d) => {
      setChartConfig(d.chartConfig);
      setMultipleData(d.multipleData);
    });
  }, []);

  const config = useMemo<ChartConfig>(
    () =>
      tagsPerReport[currentReportId].reduce(
        (acc, tag) => ({
          ...acc,
          [tag]: {
            label: tag,
          },
        }),
        {}
      ),
    [currentReportId, tagsPerReport]
  );

  const { formattedData, metrics } = useMemo(() => {
    const pattern = findPatterns(multipleEventData[currentReportId].data, tagsPerReport[currentReportId]);
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
      ...tagsPerReport[currentReportId].reduce(
        (acc, tag, i) => {
          const current =
            i > 0 ? pattern[tag][index] - pattern[tagsPerReport[currentReportId][i - 1]][index] : 0;
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

    tagsPerReport[currentReportId].forEach((tag, i) => {
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
          start_event: tagsPerReport[currentReportId][i - 1],
          end_event: tagsPerReport[currentReportId][i],
        });
      }
    });

    return {
      formattedData,
      metrics,
    };
  }, [currentReportId, multipleEventData, tagsPerReport]);

  useEffect(() => {
    // const url = new URL(window.location.href);

    // if (tagsPerReport[currentReportId].length) {
    //   url.searchParams.set('tags', tagsPerReport[currentReportId].join(','));
    //   window.history.pushState({}, '', url);
    // } else {
    //   url.searchParams.delete('tags');
    //   window.history.pushState({}, '', url);
    // }
  }, [currentReportId, tagsPerReport]);

  return (
    <>
      <Header />
      <div
        className={cn(
          'grid',
          'grid-cols-[max-content,1fr]',
          'grid-rows-1',
          'w-full',
          'h-full'
        )}
      >
        <SideBar
          reports={reports}
          currentReportId={currentReportId}
          setCurrentReportId={setCurrentReportId}
          tagsPerReport={tagsPerReport}
          setTagsPerReport={setTagsPerReport}
          uniqueTagsWithCountForMultipleReport={
            uniqueTagsWithCountForMultipleReport
          }
        />
        <main
          className={cn(
            'overflow-x-hidden',
            'overflow-y-auto',
            'py-24',
            'px-8'
          )}
        >
          {tagsPerReport[currentReportId].length > 1 ? (
            <>
              {/* Stacked Bar Chart */}
              <div
                className={cn('p-2', 'rounded-xl', 'bg-card', 'mt-4', 'w-500')}
              >
                <StackedBarChart
                  config={config}
                  formattedData={formattedData}
                  uniqueTagsWithCount={uniqueTagsWithCountForMultipleReport[currentReportId]}
                  tags={tagsPerReport[currentReportId]}
                />
              </div>

              {/** Data Table showing statistical data */}
              <DataTable columns={metricColumns} data={metrics} />

              {/** Bar Chart for comparing multiple reports */}
              {multipleData ? (
                <BarChartMultiple
                  chartData={multipleData}
                  chartConfig={chartConfig}
                />
              ) : null}

              {/** Total Iteration Count */}
              <TotalItrCountCard count={formattedData.length} />

              {/** Timeline View */}
              <TimelineViewData formattedData={formattedData} />
            </>
          ) : (
            // Empty Page
            <EmptyPage tags={tagsPerReport[currentReportId]} />
          )}
        </main>
      </div>
    </>
  );
}
