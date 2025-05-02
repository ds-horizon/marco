import { Button } from '../ui/button';

import { cn } from '~/utils/cn';
import { Checkbox } from '@radix-ui/react-checkbox';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import React from 'react';

interface ComparisonPanelSidebarProps {
  reports: {
    reportKey: string;
    reportName: string;
    reportPath: string;
  }[];
  selectedReportsOrder: number[];
  tagsPerReport: string[][];
  setTagsPerReport: React.Dispatch<React.SetStateAction<string[][]>>;
  setSelectedReportsOrder: React.Dispatch<React.SetStateAction<number[]>>;
  setOrderOfReport: (order: number[]) => void;
  uniqueTagsWithCountForMultipleReport: {
    [tag: string]: number;
  }[];
  tooltipText: string;
  handleCompare: () => void;
}

export function ComparisonPanelSidebar({
  reports,
  selectedReportsOrder,
  tagsPerReport,
  setTagsPerReport,
  setOrderOfReport,
  uniqueTagsWithCountForMultipleReport,
  tooltipText,
  handleCompare,
}: ComparisonPanelSidebarProps) {
  const toggleReportSelection = (index: number) => {
    if (selectedReportsOrder.includes(index)) {
      setOrderOfReport(selectedReportsOrder.filter((i) => i !== index));
    } else {
      setOrderOfReport([...selectedReportsOrder, index]);
    }
  };

  const toggleTag = (reportIndex: number, tag: string) => {
    const currentTags = tagsPerReport[reportIndex] || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    const updatedAllTags = [...tagsPerReport];
    updatedAllTags[reportIndex] = updatedTags;
    setTagsPerReport(updatedAllTags);
  };

  const canCompare =
    selectedReportsOrder.length >= 2 &&
    selectedReportsOrder.every((index) => tagsPerReport[index]?.length);

  return (
    <aside className="min-w-[280px] max-w-xs border-r border-border p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Select Reports</h2>
      <div className="space-y-2">
        {reports.map((report, index) => (
          <div key={report.reportKey}>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={selectedReportsOrder.includes(index)}
                onCheckedChange={() => toggleReportSelection(index)}
              />
              <span>{report.reportName}</span>
            </label>
            {selectedReportsOrder.includes(index) && (
              <div className="ml-4 mt-2">
                <ScrollArea className="h-40 pr-2">
                  {Object.entries(
                    uniqueTagsWithCountForMultipleReport[index] || {}
                  ).map(([tag, count]) => (
                    <label key={tag} className="flex items-center gap-2 mb-1">
                      <Checkbox
                        checked={tagsPerReport[index]?.includes(tag)}
                        onCheckedChange={() => toggleTag(index, tag)}
                      />
                      <span className="text-sm">
                        {tag} ({count})
                      </span>
                    </label>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button
          disabled={!canCompare}
          onClick={handleCompare}
          className={cn(
            'w-full',
            !canCompare && 'opacity-50 cursor-not-allowed'
          )}
        >
          Compare Reports
        </Button>
        {!canCompare && tooltipText && (
          <p className="text-sm text-muted-foreground mt-2">{tooltipText}</p>
        )}
      </div>
    </aside>
  );
}
