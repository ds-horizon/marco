import React, { useState } from 'react';
import { cn } from '~/utils/cn';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ReportType } from '~/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface IndividualReportSidebarProps {
  reports: ReportType[];
  selectedReport: number;
  onReportChange: (reportIndex: number) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  tagStats: {
    [key: string]: {
      count: number;
      color: string;
    };
  };
}

export const IndividualReportSidebar = ({
  reports,
  selectedReport,
  onReportChange,
  tags,
  setTags,
  tagStats,
}: IndividualReportSidebarProps) => {
  const [selectAll, setSelectAll] = useState(false);

  React.useEffect(() => {
    const allTags = Object.keys(tagStats);
    setSelectAll(
      allTags.length > 0 &&
        allTags.length === tags.length &&
        allTags.every((tag) => tags.includes(tag))
    );
  }, [tags, tagStats]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setTags(selectAll ? [] : Object.keys(tagStats));
  };

  const handleClear = () => {
    setSelectAll(false);
    setTags([]);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setTags(newTags);
  };

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
        'py-24',
        'border-r'
      )}
    >
      <div
        className={cn(
          'mb-4',
          'p-2',
          'bg-background/80',
          'backdrop-blur',
          'sticky',
          'left-0',
          '-mt-16',
          '-top-4',
          'mb-12',
          'flex',
          'flex-col',
          'items-center',
          'justify-between',
          'gap-2',
          'z-40'
        )}
      >
        <div className="w-full mb-4">
          <h2 className="text-sm font-medium mb-2">Select Report</h2>
          <Select
            value={selectedReport.toString()}
            onValueChange={(value) => onReportChange(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a report">
                {reports[selectedReport]?.reportName || 'Select a report'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {reports.map((report, index) => (
                <SelectItem
                  key={report.reportKey}
                  value={index.toString()}
                  className="cursor-pointer"
                >
                  {report.reportName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-2">
        <div className="border rounded-lg p-4 mb-4 bg-background">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Select Event</h3>
            <div className="flex items-center gap-2">
              <Button
                disabled={tags.length === 0}
                onClick={handleClear}
                variant="secondary"
                size="sm"
              >
                Clear All
              </Button>
              <label className="flex items-center gap-1 cursor-pointer select-none">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="shrink-0"
                />
                <span className="text-xs">All</span>
              </label>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {tags.length} of {Object.keys(tagStats).length} events selected
          </div>
          <div className="space-y-1">
            {Object.entries(tagStats).map(
              ([tag, { count, color }], index, arr) => {
                const selected = tags.includes(tag);
                const isBefore =
                  arr.findIndex((t) => t[0] === tags.at(-1)) > index;
                return (
                  <div
                    key={tag}
                    className={cn(
                      'group',
                      'px-3',
                      'py-2',
                      'flex',
                      'items-center',
                      'w-full',
                      'cursor-pointer',
                      'gap-3',
                      'rounded-md',
                      'transition-all',
                      !selected && isBefore && 'opacity-20 pointer-events-none',
                      !selected && !isBefore && 'hover:bg-accent/50',
                      selected && 'bg-accent',
                      selected && 'hover:bg-accent/80'
                    )}
                    onClick={() => handleTagToggle(tag)}
                  >
                    <span className="text-sm flex items-center gap-2 min-w-0 max-w-[120px] truncate">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="truncate">{tag}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {count} occurrences
                        </span>
                      </div>
                    </span>
                    <Checkbox
                      checked={selected}
                      className="shrink-0 ml-2"
                      disabled={!selected && isBefore}
                    />
                  </div>
                );
              }
            )}
          </div>
          {Object.keys(tagStats).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No events available in this report
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
