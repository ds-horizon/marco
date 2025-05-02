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
          'p-3',
          'bg-background/80',
          'backdrop-blur',
          'sticky',
          'left-0',
          'border-b',
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

        <div
          className={cn(
            'flex',
            'items-center',
            'justify-between',
            'w-full',
            'p-3',
            'border-t',
            'border-b'
          )}
        >
          <h1 className={cn('font-bold', 'text-lg')}>Events</h1>
          <div className={cn('flex', 'items-center', 'gap-2')}>
            <Button
              disabled={tags.length === 0}
              onClick={handleClear}
              variant="secondary"
              size="sm"
            >
              Clear
            </Button>
            <Button
              onClick={handleSelectAll}
              variant="secondary"
              size="sm"
              className={selectAll ? 'bg-primary text-primary-foreground' : ''}
            >
              All
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-1 px-2">
        {/* Event count summary */}
        <div className="text-sm text-muted-foreground mb-4">
          {tags.length} of {Object.keys(tagStats).length} events selected
        </div>

        {/* Event list */}
        <div className="space-y-1">
          {Object.entries(tagStats).map(([tag, { count, color }]) => (
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
                'border-l-4',
                'transition-all',
                'hover:bg-accent/50',
                tags.includes(tag) && 'bg-accent',
                tags.includes(tag) && 'hover:bg-accent/80'
              )}
              onClick={() => handleTagToggle(tag)}
              style={{
                borderLeftColor: color,
              }}
            >
              <div className={cn('w-full', 'min-w-0')}>
                <p className="block w-full truncate font-medium">{tag}</p>
                <p className={cn('text-sm', 'text-muted-foreground')}>
                  {count} occurrences
                </p>
              </div>
              <Checkbox checked={tags.includes(tag)} className="shrink-0" />
            </div>
          ))}
        </div>

        {/* Show message when no events are available */}
        {Object.keys(tagStats).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No events available in this report
          </div>
        )}
      </div>
    </aside>
  );
};
