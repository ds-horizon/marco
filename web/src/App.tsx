import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '~/utils/cn';
import { tagWiseCountAndColor } from '~/utils/data';

import { Header } from './header';
import { EmptyPage } from './components/empty-page';
import { ReportInsightsCard } from './components/analytics-card/report-insights-cards';
import { TooltipProvider } from './components/ui/tooltip';
import { ComparisonBarChart } from './components/charts/comparison-bar-chart';
import { SideBar } from './components/sidebar/sidebar';
import { IndividualReportSidebar } from './components/sidebar/IndividualReportSidebar';

import {
  IComparisonBarCharConfig,
  IComparisonBarChartData,
  ReportType,
  useReportEntries,
  visualiseMultipleReports,
} from './data';

export function App() {
  const reportEntries = useReportEntries();

  const tagCountByReport = useMemo(
    () => reportEntries.map((report) => tagWiseCountAndColor(report.data)),
    [reportEntries]
  );

  const reportList: ReportType[] = useMemo(
    () =>
      reportEntries.map((report) => ({
        reportKey: report.reportKey,
        reportName: report.reportName,
        reportPath: report.reportPath,
      })),
    [reportEntries]
  );

  const [tagsPerReport, setTagsPerReport] = useState<string[][]>(
    new Array(reportEntries.length).fill([])
  );
  const [selectedReportsOrder, setSelectedReportsOrder] = useState<number[]>(
    []
  );
  const [selectedIndividualReport, setSelectedIndividualReport] =
    useState<number>(reportEntries.length > 0 ? 0 : -1);

  const [comparisonData, setComparisonData] = useState<{
    data: IComparisonBarChartData;
    metrics: Record<
      string,
      {
        diff: number[];
        tags: string[];
      }
    >;
  } | null>(null);
  const [chartConfig, setChartConfig] = useState<IComparisonBarCharConfig>({});
  const [currentTab, setCurrentTab] = useState<'reports' | 'comparison'>(
    'reports'
  );

  const generateComparisonData = useCallback(() => {
    const { chartConfig, multipleData, metrics } = visualiseMultipleReports(
      tagsPerReport,
      selectedReportsOrder
    );
    setChartConfig(chartConfig);
    setComparisonData({ data: multipleData, metrics });
    setCurrentTab('comparison');
  }, [selectedReportsOrder, tagsPerReport]);

  const clearComparisonData = useCallback(() => {
    setComparisonData(null);
  }, []);

  const getTooltipMessage = useCallback(() => {
    if (selectedReportsOrder.length < 1) {
      return 'Select events from at least 2 reports to compare.';
    } else if (selectedReportsOrder.length === 1) {
      return 'Select events from 1 more report to compare.';
    }
    return '';
  }, [selectedReportsOrder.length]);

  const tooltipText = useMemo(() => getTooltipMessage(), [getTooltipMessage]);

  const handleIndividualReportChange = useCallback((reportIndex: number) => {
    setSelectedIndividualReport(reportIndex);
    setSelectedReportsOrder([reportIndex]);
  }, []);

  return (
    <>
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />
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
          {currentTab === 'reports' ? (
            <IndividualReportSidebar
              reports={reportList}
              selectedReport={selectedIndividualReport}
              onReportChange={handleIndividualReportChange}
              tags={tagsPerReport[selectedIndividualReport] || []}
              setTags={(newTags) => {
                setTagsPerReport((prev) => {
                  const updated = [...prev];
                  updated[selectedIndividualReport] = newTags;
                  return updated;
                });
              }}
              tagStats={tagCountByReport[selectedIndividualReport] || {}}
            />
          ) : (
            <SideBar
              selectedReportsOrder={selectedReportsOrder}
              reports={reportList}
              tagsPerReport={tagsPerReport}
              setTagsPerReport={setTagsPerReport}
              uniqueTagsWithCountForMultipleReport={tagCountByReport}
              setOrderOfReport={setSelectedReportsOrder}
              tooltipText={tooltipText}
              handleCompare={generateComparisonData}
            />
          )}
          <main
            className={cn(
              'overflow-x-hidden',
              'overflow-y-auto',
              'py-24',
              'items-center',
              'justify-center',
              'px-8'
            )}
          >
            {currentTab === 'reports' && selectedIndividualReport >= 0 ? (
              tagsPerReport[selectedIndividualReport]?.length >= 2 ? (
                <AnimatePresence>
                  <motion.div
                    key={selectedIndividualReport}
                    layout
                    layoutId={`card-${selectedIndividualReport}`}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{
                      layout: { duration: 0.4, ease: 'easeInOut' },
                      opacity: { duration: 0.2 },
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
                    <ReportInsightsCard
                      reportInfo={reportList[selectedIndividualReport]}
                      data={reportEntries[selectedIndividualReport].data}
                      uniqueTagsWithCount={
                        tagCountByReport[selectedIndividualReport]
                      }
                      tags={tagsPerReport[selectedIndividualReport]}
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <EmptyPage
                  content={
                    tagsPerReport[selectedIndividualReport]?.length === 0
                      ? `Select at least two events`
                      : `Select one more event `
                  }
                />
              )
            ) : currentTab === 'comparison' ? (
              <div className="flex justify-center">
                {comparisonData ? (
                  <ComparisonBarChart
                    chartData={comparisonData.data}
                    chartConfig={chartConfig}
                    metrics={comparisonData.metrics}
                    hideComparisonPanel={clearComparisonData}
                  />
                ) : (
                  <EmptyPage content={getTooltipMessage()} />
                )}
              </div>
            ) : (
              <EmptyPage content="Select a report to begin" />
            )}
          </main>
        </TooltipProvider>
      </div>
    </>
  );
}
