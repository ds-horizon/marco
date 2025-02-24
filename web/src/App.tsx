import { cn } from '~/utils/cn';
import {
  tagWiseCountAndColor,
} from '~/utils/data';

import React, { useEffect, useMemo, useState } from 'react';
import { visualiseMultipleReports } from './data';
import { Header } from './header';
import {  showEmptyPage } from './utils/helpers';
import { SideBar } from './components/sidebar';
import { EmptyPage } from './components/empty-page';
import { ReportType, useMultipleReportData } from './data-multiple';
import { DataContainer } from './components/data-container';

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
  const [orderOfReport, setOrderOfReport] = useState<number[]>([]);

  const [multipleData, setMultipleData] = useState(null);
  const [chartConfig, setChartConfig] = useState(null);

  useEffect(() => {
    visualiseMultipleReports().then((d) => {
      setChartConfig(d.chartConfig);
      setMultipleData(d.multipleData);
    });
  }, []);

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
          setOrderOfReport={setOrderOfReport}
        />
        <main
          className={cn(
            'overflow-x-hidden',
            'overflow-y-auto',
            'py-24',
            'px-8'
          )}
        >
          {!showEmptyPage(tagsPerReport) ? (
            <>
              {
                orderOfReport.map((order) => {
                    return (
                      <div className={cn('p-2', 'rounded-xl', 'bg-card', 'mt-4', 'w-200', 'max-w-100')}>
                        <DataContainer
                          reportInfo={reports[order]}
                          data={multipleEventData[order].data}
                          uniqueTagsWithCount={uniqueTagsWithCountForMultipleReport[order]}
                          tags={tagsPerReport[order]}
                        />
                    </div>
                    )
                })
              }

              {/** Bar Chart for comparing multiple reports */}
              {/* {multipleData ? (
                <BarChartMultiple
                  chartData={multipleData}
                  chartConfig={chartConfig}
                />
              ) : null} */}
            </>
          ) : (
            // Empty Page
            <EmptyPage />
          )}
        </main>
      </div>
    </>
  );
}
