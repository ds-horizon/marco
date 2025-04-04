import { cn } from '~/utils/cn';
import { tagWiseCountAndColor } from '~/utils/data';

import { useCallback, useMemo, useState } from 'react';
import { Header } from './header';
import { showEmptyPage } from './utils/helpers';
import { SideBar } from './components/sidebar/sidebar';
import { EmptyPage } from './components/empty-page';
import {
  IComparisonBarCharConfig,
  IComparisonBarChartData,
  ReportType,
  useReportEntries,
  visualiseMultipleReports,
} from './data';
import { ReportInsightsCard } from './components/analytics-card/report-insights-cards';
import { motion, AnimatePresence } from 'framer-motion';
import { ComparisonBarChart } from './components/charts/comparison-bar-chart';
import { TooltipProvider } from './components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

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
    console.log('Compare report');
    setChartConfig(chartConfig);
    setComparisonData({
      data: multipleData,
      metrics: metrics,
    });
    setCurrentTab('comparison');
  }, [selectedReportsOrder, tagsPerReport]);

  const clearComparisonData = useCallback(() => {
    setComparisonData(null);
  }, []);

  const getTooltipMessage = useCallback(() => {
    let text = '';
    if (selectedReportsOrder.length < 1) {
      text = 'Select events from at least 2 reports to compare.';
    } else if (selectedReportsOrder.length === 1) {
      text = 'Select events from 1 more report to compare.';
    }
    return text;
  }, [selectedReportsOrder.length]);

  const tooltipText = useMemo(() => getTooltipMessage(), [getTooltipMessage]);

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
            selectedReportsOrder={selectedReportsOrder}
            reports={reportList}
            tagsPerReport={tagsPerReport}
            setTagsPerReport={setTagsPerReport}
            uniqueTagsWithCountForMultipleReport={tagCountByReport}
            setOrderOfReport={setSelectedReportsOrder}
            tooltipText={tooltipText}
            handleCompare={generateComparisonData}
          />
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
            {!showEmptyPage(tagsPerReport) ? (
              <Tabs
                defaultValue="reports"
                className="w-full justify-center"
                value={currentTab}
                onValueChange={() => {
                  setCurrentTab((prev) =>
                    prev === 'comparison' ? 'reports' : 'comparison'
                  );
                }}
              >
                <div className="flex justify-center mt-4 mb-6">
                  <TabsList className={'mr-40'}>
                    <TabsTrigger value="reports">Individual Report</TabsTrigger>
                    <TabsTrigger value="comparison">
                      Comparison Panel
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="reports">
                  <AnimatePresence>
                    {selectedReportsOrder.map((order) => {
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
                          <ReportInsightsCard
                            reportInfo={reportList[order]}
                            data={reportEntries[order].data}
                            uniqueTagsWithCount={tagCountByReport[order]}
                            tags={tagsPerReport[order]}
                          />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </TabsContent>
                <TabsContent value="comparison" className="flex justify-center">
                  {/** Bar Chart for comparing multiple reports */}
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
                </TabsContent>
              </Tabs>
            ) : (
              // Empty Page
              <EmptyPage content="Select at least two tags to compare." />
            )}
          </main>
        </TooltipProvider>
      </div>
    </>
  );
}
