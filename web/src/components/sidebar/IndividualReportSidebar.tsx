import React, { useState } from 'react';
import { cn } from '~/utils/cn';
import { Checkbox } from '../ui/checkbox';
import { ReportType } from '~/data';
import Select, { SingleValue, StylesConfig, GroupBase } from 'react-select';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

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

  const handleTagToggle = (tag: string) => {
    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setTags(newTags);
  };

  const reportOptions = reports.map((report, index) => ({
    value: index,
    label: report.reportName,
  }));

  const customSelectStyles: StylesConfig<
    { value: number; label: string },
    false,
    GroupBase<{ value: number; label: string }>
  > = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#18181b',
      borderColor: '#27272a',
      color: '#fff',
      width: 240,
      minWidth: 240,
      maxWidth: 240,
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#18181b',
      color: '#fff',
      width: 240,
      minWidth: 240,
      maxWidth: 240,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? '#27272a'
        : state.isSelected
          ? '#3f3f46'
          : '#18181b',
      color: '#fff',
      cursor: 'pointer',
    }),
    input: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#a1a1aa',
    }),
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
        'py-28',
        'border-r',
        'hidden md:block'
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
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium mb-2">Select Report</h2>
            <Select
              options={reportOptions}
              value={reportOptions.find(
                (option) => option.value === selectedReport
              )}
              onChange={(
                selectedOption: SingleValue<{ value: number; label: string }>
              ) => {
                if (selectedOption) {
                  onReportChange(selectedOption.value);
                }
              }}
              placeholder="Select report"
              classNamePrefix="react-select"
              styles={customSelectStyles}
            />
          </div>
        </div>
      </div>

      <div className="px-2">
        <div className="border rounded-lg p-4 mb-4 bg-background">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Select Event</h3>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-2 cursor-pointer select-none">
                <span className="text-xs">All</span>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="shrink-0"
                />
              </label>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {tags.length} of {Object.keys(tagStats).length} events selected
          </div>
          <div className="flex flex-col gap-1">
            {Object.entries(tagStats).map(
              ([tag, { count, color }], index, arr) => {
                const selected = tags.includes(tag);
                const isBefore =
                  arr.findIndex((t) => t[0] === tags.at(-1)) > index;
                const disabled = !selected && isBefore;

                const eventRow = (
                  <div
                    key={tag}
                    className={cn(
                      'flex items-center justify-between',
                      'px-2 py-2 rounded-md cursor-pointer transition-all',
                      'hover:bg-accent/50',
                      selected && 'bg-accent hover:bg-accent/80',
                      disabled && 'opacity-20'
                    )}
                    onClick={() => !disabled && handleTagToggle(tag)}
                    tabIndex={disabled ? 0 : -1}
                  >
                    <span className="text-sm flex items-center gap-2 min-w-0 max-w-[140px] truncate">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="truncate" title={tag}>
                          {tag}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {count} occurrences
                        </span>
                      </div>
                    </span>
                    <Checkbox
                      checked={selected}
                      className="shrink-0"
                      disabled={disabled}
                    />
                  </div>
                );

                return disabled ? (
                  <Tooltip key={tag}>
                    <TooltipTrigger asChild>{eventRow}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      <span>
                        To select this event, please deselect any events that
                        come after it in the sequence.
                      </span>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  eventRow
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
