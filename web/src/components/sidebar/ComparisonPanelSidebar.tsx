import { Button } from '../ui/button';
import { cn } from '~/utils/cn';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { ReportType } from '~/data';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { X } from 'lucide-react';
import React from 'react';

interface ComparisonPanelSidebarProps {
  reports: ReportType[];
  selectedReportsOrder: number[];
  tagsPerReport: string[][];
  setTagsPerReport: React.Dispatch<React.SetStateAction<string[][]>>;
  setSelectedReportsOrder: React.Dispatch<React.SetStateAction<number[]>>;
  uniqueTagsWithCountForMultipleReport: {
    [key: string]: {
      count: number;
      color: string;
    };
  }[];
  tooltipText: string;
  handleCompare: () => void;
}

export function ComparisonPanelSidebar({
  reports,
  selectedReportsOrder,
  tagsPerReport,
  setTagsPerReport,
  setSelectedReportsOrder,
  uniqueTagsWithCountForMultipleReport,
  tooltipText,
  handleCompare,
}: ComparisonPanelSidebarProps) {
  const addReport = (index: number) => {
    if (!selectedReportsOrder.includes(index)) {
      setSelectedReportsOrder([...selectedReportsOrder, index]);
    }
  };

  const removeReport = (index: number) => {
    setSelectedReportsOrder(selectedReportsOrder.filter((i) => i !== index));
    // Clear tags for the removed report
    setTagsPerReport((prev) => {
      const updated = [...prev];
      updated[index] = [];
      return updated;
    });
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

  const selectAllTags = (reportIndex: number) => {
    const allTags = Object.keys(
      uniqueTagsWithCountForMultipleReport[reportIndex] || {}
    );
    setTagsPerReport((prev) => {
      const updated = [...prev];
      updated[reportIndex] = allTags;
      return updated;
    });
  };

  const clearTags = (reportIndex: number) => {
    setTagsPerReport((prev) => {
      const updated = [...prev];
      updated[reportIndex] = [];
      return updated;
    });
  };

  const canCompare =
    selectedReportsOrder.length >= 2 &&
    selectedReportsOrder.every((index) => tagsPerReport[index]?.length > 0);

  return (
    <aside
      className={cn(
        'w-64',
        'h-full',
        'overflow-x-hidden',
        'overflow-y-auto',
        'sticky',
        'top-0',
        'left-0',
        'z-40',
        'pt-24',
        'pb-4',
        'px-4',
        'border-r'
      )}
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-medium mb-2">Select Report</h2>
          <Select onValueChange={(value) => addReport(parseInt(value))}>
            <SelectTrigger className="z-50">
              <SelectValue placeholder="Add a report to compare" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-50">
              {reports.map((report, index) => (
                <SelectItem
                  key={report.reportKey}
                  value={index.toString()}
                  disabled={selectedReportsOrder.includes(index)}
                >
                  {report.reportName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedReportsOrder.map((reportIndex) => {
          const report = reports[reportIndex];
          return (
            <div
              key={report.reportKey}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium mb-2">
                  {report.reportName}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeReport(reportIndex)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectAllTags(reportIndex)}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearTags(reportIndex)}
                >
                  Clear
                </Button>
              </div>

              <ScrollArea className="h-[200px] pr-2">
                {Object.entries(
                  uniqueTagsWithCountForMultipleReport[reportIndex] || {}
                ).map(([tag, { count, color }]) => (
                  <label
                    key={tag}
                    className="flex items-center gap-2 mb-2 hover:bg-accent/50 p-1 rounded justify-between"
                  >
                    <span
                      className="text-sm flex items-center gap-2 min-w-0 max-w-[120px] truncate"
                      title={tag}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {tag}
                      <span className="text-muted-foreground">({count})</span>
                    </span>
                    <Checkbox
                      checked={tagsPerReport[reportIndex]?.includes(tag)}
                      onCheckedChange={() => toggleTag(reportIndex, tag)}
                      className="shrink-0"
                    />
                  </label>
                ))}
              </ScrollArea>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Tooltip>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          {!canCompare && tooltipText && (
            <TooltipContent>
              <p className="text-sm">{tooltipText}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
}
