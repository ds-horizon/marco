import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '~/utils/cn';
import { tagWiseCountAndColor } from '~/utils/data';

import { Header } from './header';
import { EmptyPage } from './components/empty-page';
import { ReportInsightsCard } from './components/analytics-card/report-insights-cards';
import { TooltipProvider } from './components/ui/tooltip';
import { ComparisonBarChart } from './components/charts/comparison-bar-chart';
import { IndividualReportSidebar } from './components/sidebar/IndividualReportSidebar';
import { ComparisonPanelSidebar } from './components/sidebar/ComparisonPanelSidebar';

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

  const initialSelectionDone = useRef(false);

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

  useEffect(() => {
    if (
      !initialSelectionDone.current &&
      reportEntries.length > 0 &&
      tagsPerReport[0]?.length === 0 &&
      Object.keys(tagCountByReport[0] || {}).length > 0
    ) {
      setTagsPerReport((prev) => {
        const updated = [...prev];
        updated[0] = Object.keys(tagCountByReport[0]);
        return updated;
      });
      initialSelectionDone.current = true;
    }
  }, [reportEntries, tagCountByReport, tagsPerReport]);

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
            <ComparisonPanelSidebar
              reports={reportList}
              selectedReportsOrder={selectedReportsOrder}
              tagsPerReport={tagsPerReport}
              setTagsPerReport={setTagsPerReport}
              setSelectedReportsOrder={setSelectedReportsOrder}
              uniqueTagsWithCountForMultipleReport={tagCountByReport}
              tooltipText={tooltipText}
              handleCompare={generateComparisonData}
            />
          )}
          <main className="p-6 pt-24">
            {currentTab === 'reports' ? (
              selectedIndividualReport >= 0 ? (
                <ReportInsightsCard
                  data={reportEntries[selectedIndividualReport].data}
                  uniqueTagsWithCount={
                    tagCountByReport[selectedIndividualReport]
                  }
                  tags={tagsPerReport[selectedIndividualReport] || []}
                  reportInfo={reportList[selectedIndividualReport]}
                />
              ) : (
                <EmptyPage content="Select a report to begin" />
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
