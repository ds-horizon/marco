import { Button } from '../ui/button';
import { cn } from '~/utils/cn';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { ReportType } from '~/data';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { X } from 'lucide-react';
import React from 'react';
import Select, { MultiValue, StylesConfig, GroupBase } from 'react-select';

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

  const reportsWithEvents = selectedReportsOrder.filter(
    (index) => tagsPerReport[index]?.length > 0
  );
  const canCompare = reportsWithEvents.length >= 2;

  const reportOptions = reports.map((report, index) => ({
    value: index,
    label: report.reportName,
  }));

  const customSelectStyles: StylesConfig<
    { value: number; label: string },
    true,
    GroupBase<{ value: number; label: string }>
  > = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#18181b', // Tailwind's bg-background in dark
      borderColor: '#27272a',
      color: '#fff',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#18181b',
      color: '#fff',
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
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#27272a',
      color: '#fff',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#fff',
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
        'pt-24',
        'pb-4',
        'px-2',
        'border-r',
        'hidden md:block'
      )}
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-medium mb-2">Select Reports</h2>
          <Select
            isMulti
            options={reportOptions}
            value={reportOptions.filter((option) =>
              selectedReportsOrder.includes(option.value)
            )}
            onChange={(
              selectedOptions: MultiValue<{ value: number; label: string }>
            ) => {
              const selectedIndexes = selectedOptions.map(
                (option) => option.value
              );
              setSelectedReportsOrder(selectedIndexes);
              setTagsPerReport((prev) => {
                const updated = [...prev];
                reports.forEach((_, idx) => {
                  if (!selectedIndexes.includes(idx)) {
                    updated[idx] = [];
                  }
                });
                return updated;
              });
            }}
            placeholder="Select reports"
            classNamePrefix="react-select"
            styles={{
              ...customSelectStyles,
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={
              typeof window !== 'undefined' ? document.body : null
            }
          />
        </div>

        {selectedReportsOrder.map((reportIndex) => {
          const report = reports[reportIndex];
          return (
            <div
              key={report.reportKey}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3
                  className="text-sm font-medium mb-2 truncate hover:bg-accent/80"
                  title={report.reportName}
                >
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

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Select Event</h3>
                <div className="flex items-center gap-2 pr-3">
                  <label className="flex items-center gap-1 cursor-pointer select-none">
                    <span className="text-xs">All</span>
                    <Checkbox
                      checked={
                        Object.keys(
                          uniqueTagsWithCountForMultipleReport[reportIndex] ||
                            {}
                        ).length === tagsPerReport[reportIndex]?.length
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAllTags(reportIndex);
                        } else {
                          setTagsPerReport((prev) => {
                            const updated = [...prev];
                            updated[reportIndex] = [];
                            return updated;
                          });
                        }
                      }}
                      className="shrink-0"
                    />
                  </label>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mb-2">
                {tagsPerReport[reportIndex]?.length || 0} of{' '}
                {
                  Object.keys(
                    uniqueTagsWithCountForMultipleReport[reportIndex] || {}
                  ).length
                }{' '}
                events selected
              </div>

              <ScrollArea className="max-h-[200px] pr-1 overflow-auto">
                <div className="space-y-1">
                  {Object.entries(
                    uniqueTagsWithCountForMultipleReport[reportIndex] || {}
                  ).map(([tag, { count, color }], index, arr) => {
                    const selected = tagsPerReport[reportIndex]?.includes(tag);
                    const isBefore =
                      arr.findIndex(
                        (t) => t[0] === tagsPerReport[reportIndex]?.at(-1)
                      ) > index;
                    const disabled = !selected && isBefore;

                    const eventRow = (
                      <div
                        key={tag}
                        className={cn(
                          'group',
                          'px-2',
                          'py-2',
                          'flex',
                          'items-center',
                          'w-full',
                          'cursor-pointer',
                          'gap-3',
                          'justify-between',
                          'rounded-md',
                          'transition-all',
                          disabled && 'opacity-20',
                          !selected && !isBefore && 'hover:bg-accent/50',
                          selected && 'bg-accent',
                          selected && 'hover:bg-accent/80'
                        )}
                        onClick={() => !disabled && toggleTag(reportIndex, tag)}
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
                          onCheckedChange={() => toggleTag(reportIndex, tag)}
                          className="shrink-0 ml-2"
                          disabled={disabled}
                        />
                      </div>
                    );

                    return disabled ? (
                      <Tooltip key={tag}>
                        <TooltipTrigger asChild>{eventRow}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          <span>
                            To select this event, please deselect any events
                            that come after it in the sequence.
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      eventRow
                    );
                  })}
                </div>
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
