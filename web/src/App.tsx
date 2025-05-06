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

  const [individualTagsPerReport, setIndividualTagsPerReport] = useState<
    string[][]
  >(new Array(reportEntries.length).fill([]));
  const [comparisonTagsPerReport, setComparisonTagsPerReport] = useState<
    string[][]
  >(new Array(reportEntries.length).fill([]));

  const [selectedReportsOrder, setSelectedReportsOrder] = useState<number[]>(
    []
  );
  const [selectedIndividualReport, setSelectedIndividualReport] =
    useState<number>(reportEntries.length > 0 ? 0 : -1);

  const [comparisonData, setComparisonData] = useState<{
    data: IComparisonBarChartData;
    metrics: Record<string, { diff: number[]; tags: string[] }>;
  } | null>(null);

  const [chartConfig, setChartConfig] = useState<IComparisonBarCharConfig>({});
  const [currentTab, setCurrentTab] = useState<'reports' | 'comparison'>(
    'reports'
  );

  const initialSelectionDone = useRef(false);

  const generateComparisonData = useCallback(() => {
    // Only include reports with at least one event selected
    const reportsWithEvents = selectedReportsOrder.filter(
      (index) => comparisonTagsPerReport[index]?.length > 0
    );
    if (reportsWithEvents.length < 2) {
      setComparisonData(null);
      return;
    }
    const { chartConfig, multipleData, metrics } = visualiseMultipleReports(
      comparisonTagsPerReport,
      reportsWithEvents
    );
    setChartConfig(chartConfig);
    setComparisonData({ data: multipleData, metrics });
    setCurrentTab('comparison');
  }, [selectedReportsOrder, comparisonTagsPerReport]);

  const clearComparisonData = useCallback(() => {
    setComparisonData(null);
  }, []);

  const getTooltipMessage = useCallback(() => {
    if (selectedReportsOrder.length < 2) {
      return 'Please select at least two reports to compare.';
    } else if (
      !selectedReportsOrder.every(
        (index) => comparisonTagsPerReport[index]?.length > 0
      )
    ) {
      return 'Please select at least one event in each selected report to enable comparison.';
    }
    return '';
  }, [selectedReportsOrder, comparisonTagsPerReport]);

  const tooltipText = useMemo(() => getTooltipMessage(), [getTooltipMessage]);

  const handleIndividualReportChange = useCallback((reportIndex: number) => {
    setSelectedIndividualReport(reportIndex);
  }, []);

  // Initialize individual tags with default data for the first report
  useEffect(() => {
    if (
      !initialSelectionDone.current &&
      reportEntries.length > 0 &&
      individualTagsPerReport[0]?.length === 0 &&
      Object.keys(tagCountByReport[0] || {}).length > 0
    ) {
      setIndividualTagsPerReport((prev) => {
        const updated = [...prev];
        updated[0] = Object.keys(tagCountByReport[0]);
        return updated;
      });
      initialSelectionDone.current = true;
    }
  }, [reportEntries, tagCountByReport, individualTagsPerReport]);

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
              tags={individualTagsPerReport[selectedIndividualReport] || []}
              setTags={(newTags) => {
                setIndividualTagsPerReport((prev) => {
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
              tagsPerReport={comparisonTagsPerReport}
              setTagsPerReport={setComparisonTagsPerReport}
              setSelectedReportsOrder={setSelectedReportsOrder}
              uniqueTagsWithCountForMultipleReport={tagCountByReport}
              tooltipText={tooltipText}
              handleCompare={generateComparisonData}
            />
          )}
          <main className="p-6 pt-24">
            {currentTab === 'reports' ? (
              selectedIndividualReport >= 0 ? (
                <div className="overflow-y-auto max-h-[calc(100vh-150px)] p-2">
                  <ReportInsightsCard
                    data={reportEntries[selectedIndividualReport].data}
                    uniqueTagsWithCount={
                      tagCountByReport[selectedIndividualReport]
                    }
                    tags={
                      individualTagsPerReport[selectedIndividualReport] || []
                    }
                    reportInfo={reportList[selectedIndividualReport]}
                  />
                </div>
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
                  <EmptyPage content={tooltipText} />
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
