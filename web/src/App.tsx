import { cn } from '~/utils/cn';
import { tagWiseCountAndColor } from '~/utils/data';

import React, { useMemo, useState } from 'react';
import { Header } from './header';
import { showEmptyPage } from './utils/helpers';
import { SideBar } from './components/sidebar';
import { EmptyPage } from './components/empty-page';
import {
  IComparisonBarCharConfig,
  IComparisonBarChartData,
  ReportType,
  useMultipleReportData,
  visualiseMultipleReports,
} from './data-multiple';
import { DataContainer } from './components/data-container';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChartMultiple } from './components/bar-chart-multiple';
import { TooltipProvider } from './components/ui/tooltip';

export function App() {
  const multipleEventData = useMultipleReportData();

  const uniqueTagsWithCountForMultipleReport = useMemo(
    () => multipleEventData.map((report) => tagWiseCountAndColor(report.data)),
    [multipleEventData]
  );
  const reports: ReportType[] = useMemo(
    () =>
      multipleEventData.map((report) => ({
        reportKey: report.reportKey,
        reportName: report.reportName,
        reportPath: report.reportPath,
      })),
    [multipleEventData]
  );

  const [currentReportId, setCurrentReportId] = useState<number>(0);
  const [tagsPerReport, setTagsPerReport] = useState<string[][]>(
    new Array(multipleEventData.length).fill([])
  );
  const [orderOfReport, setOrderOfReport] = useState<number[]>([]);

  const [multipleData, setMultipleData] = useState<{
    data: IComparisonBarChartData
    metrics: Record<string, {
      diff: number[],
      tags: string[]
    }>
  } | null>(null);
  const [chartConfig, setChartConfig] = useState<IComparisonBarCharConfig>({});

  const handleReportComparison = () => {
    const { chartConfig, multipleData, metrics } =
      visualiseMultipleReports(tagsPerReport);
    setChartConfig(chartConfig);
    setMultipleData({
      data: multipleData,
      metrics: metrics
    });
  };

  const hideComparisonPanel = () => {
    setMultipleData(null)
  }

  const tooltipText = () => {
    let text = ''
    if (orderOfReport.length < 1) {
      text = 'Select events from at least 2 reports to compare.'
    } else if (orderOfReport.length === 1) {
      text = 'Select events from 1 more report to compare.'
    }
    return text;
  }

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
        <TooltipProvider>
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
          tooltipText={tooltipText()}
          handleCompare={handleReportComparison}
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
            <AnimatePresence>
              {/** Bar Chart for comparing multiple reports */}
              {multipleData ? (
                <BarChartMultiple
                  chartData={multipleData.data}
                  chartConfig={chartConfig}
                  metrics={multipleData.metrics}
                  hideComparisonPanel={hideComparisonPanel}
                />
              ) : null}
              {orderOfReport.map((order) => {
                return (
                  <motion.div
                    key={order}
                    layout
                    layoutId={`card-${order}`}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }} // Quick fade-out
                    transition={{
                      layout: { duration: 0.4, ease: 'easeInOut' }, // Faster repositioning
                      opacity: { duration: 0.2 }, // Quick fade-out
                    }}
                    className={cn(
                      'p-2',
                      'rounded-xl',
                      'bg-card',
                      'mt-4',
                      'w-200',
                      'max-w-100'
                    )}
                  >
                    <DataContainer
                      reportInfo={reports[order]}
                      data={multipleEventData[order].data}
                      uniqueTagsWithCount={
                        uniqueTagsWithCountForMultipleReport[order]
                      }
                      tags={tagsPerReport[order]}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            // Empty Page
            <EmptyPage />
          )}
        </main>
        </TooltipProvider>
      </div>
    </>
  );
}
