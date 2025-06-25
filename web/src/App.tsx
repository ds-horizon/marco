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
import { Button } from './components/ui/button';
import { X } from 'lucide-react';
import { useIsMobile } from './hooks/useMobile';

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

  const [comparisonChartConfig, setComparisonChartConfig] =
    useState<IComparisonBarCharConfig>({});
  const [currentTab, setCurrentTab] = useState<'reports' | 'comparison'>(
    'reports'
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

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
    setComparisonChartConfig(chartConfig);
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
      <Header
        isMobile={isMobile}
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        onOpenSidebar={() => setIsMobileSidebarOpen(true)}
      />
      <div
        className={cn(
          'grid',
          'md:grid-cols-[max-content,1fr]',
          'grid-cols-1',
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

          {/* Mobile sidebar overlay */}
          {isMobile && isMobileSidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setIsMobileSidebarOpen(false)}
              />

              {/* Sidebar */}
              <div className="absolute left-0 top-0 h-full w-80 bg-background shadow-lg">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">
                    {currentTab === 'reports'
                      ? 'Individual Report'
                      : 'Compare Reports'}
                  </h2>
                  <Button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    size="icon"
                    variant="ghost"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="h-full overflow-y-auto pb-16">
                  {currentTab === 'reports' ? (
                    <div className="[&>aside]:!static [&>aside]:!w-full [&>aside]:!py-4 [&>aside]:!border-r-0 [&>aside]:!block">
                      <IndividualReportSidebar
                        reports={reportList}
                        selectedReport={selectedIndividualReport}
                        onReportChange={handleIndividualReportChange}
                        tags={
                          individualTagsPerReport[selectedIndividualReport] ||
                          []
                        }
                        setTags={(newTags) => {
                          setIndividualTagsPerReport((prev) => {
                            const updated = [...prev];
                            updated[selectedIndividualReport] = newTags;
                            return updated;
                          });
                        }}
                        tagStats={
                          tagCountByReport[selectedIndividualReport] || {}
                        }
                      />
                    </div>
                  ) : (
                    <div className="[&>aside]:!static [&>aside]:!w-full [&>aside]:!py-4 [&>aside]:!border-r-0 [&>aside]:!block">
                      <ComparisonPanelSidebar
                        reports={reportList}
                        selectedReportsOrder={selectedReportsOrder}
                        tagsPerReport={comparisonTagsPerReport}
                        setTagsPerReport={setComparisonTagsPerReport}
                        setSelectedReportsOrder={setSelectedReportsOrder}
                        uniqueTagsWithCountForMultipleReport={tagCountByReport}
                        tooltipText={tooltipText}
                        handleCompare={() => {
                          generateComparisonData();
                          setIsMobileSidebarOpen(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <main className="p-4 pt-24">
            <div className="w-full">
              {currentTab === 'reports' ? (
                selectedIndividualReport >= 0 ? (
                  <div className="overflow-y-auto max-h-[calc(100vh-150px)] p-2 md:p-2 w-full">
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
                  <EmptyPage
                    content={
                      isMobile
                        ? 'Tap the menu button to select a report'
                        : 'Select a report to begin'
                    }
                  />
                )
              ) : currentTab === 'comparison' ? (
                <div className="w-full">
                  {comparisonData ? (
                    <div className="overflow-x-auto">
                      <ComparisonBarChart
                        chartData={comparisonData.data}
                        chartConfig={comparisonChartConfig}
                        metrics={comparisonData.metrics}
                        hideComparisonPanel={clearComparisonData}
                      />
                    </div>
                  ) : (
                    <EmptyPage
                      content={
                        isMobile
                          ? 'Tap the menu button to select reports for comparison'
                          : tooltipText
                      }
                    />
                  )}
                </div>
              ) : (
                <EmptyPage content="Select a report to begin" />
              )}
            </div>
          </main>
        </TooltipProvider>
      </div>
    </>
  );
}
