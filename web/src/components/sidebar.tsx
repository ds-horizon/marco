import React, { useState } from 'react';
import { cn } from '~/utils/cn';
import { Button } from './ui/button';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from './ui/checkbox';
import { SelectReport } from './select-report';
import { ReportType } from '~/data-multiple';

interface SideBarProps {
  reports: ReportType[];
  currentReportId: number;
  setCurrentReportId: React.Dispatch<React.SetStateAction<number>>;
  setTagsPerReport: React.Dispatch<React.SetStateAction<string[][]>>;
  tagsPerReport: string[][];
  uniqueTagsWithCountForMultipleReport: {
    [key: string]: {
      count: number;
      color: string;
    };
  }[];
  setOrderOfReport: React.Dispatch<React.SetStateAction<number[]>>;
  disableComparisonCTA: boolean
  handleCompare: () => void
}

export const SideBar = ({
  reports,
  uniqueTagsWithCountForMultipleReport,
  currentReportId,
  setCurrentReportId,
  tagsPerReport,
  setTagsPerReport,
  setOrderOfReport,
  disableComparisonCTA,
  handleCompare
}: SideBarProps) => {
  const [allSelectedPerReports, setAllSelectedPerReports] = useState<
    CheckedState[]
  >(new Array(reports.length).fill(false));

  const handleClear = () => {
    setTagsPerReport((prev) => {
      return prev.map((tags, index) => (index === currentReportId ? [] : tags));
    });

    setOrderOfReport((prev) => prev.filter((id) => id !== currentReportId));
  };

  const handleCheckedChange = () => {
    const allSelectedStatus = allSelectedPerReports[currentReportId];
    setAllSelectedPerReports((prev) =>
      prev.map((value, index) => (index === currentReportId ? !value : value))
    );
    setTagsPerReport((prev) => {
      return prev.map((tags, index) => {
        if (index === currentReportId) {
          if (allSelectedStatus) {
            return [];
          } else {
            return Object.keys(
              uniqueTagsWithCountForMultipleReport[currentReportId]
            );
          }
        } else {
          return tags;
        }
      });
    });

    setOrderOfReport((prev) => {
      const filtered = prev.filter((id) => id !== currentReportId);
      if (allSelectedStatus) {
        return filtered;
      } else {
        if (
          Object.keys(uniqueTagsWithCountForMultipleReport[currentReportId])
            .length >= 2
        ) {
          return [currentReportId, ...filtered];
        }
        return filtered;
      }
    });
  };

  const handleEventClick = (tag: string) => {
    if (tagsPerReport[currentReportId].includes(tag)) {
      setTagsPerReport((prev) => {
        return prev.map((tags, index) =>
          index === currentReportId ? tags.filter((t) => t !== tag) : tags
        );
      });

      const numOfTags = tagsPerReport[currentReportId].length - 1;

      setOrderOfReport((prev) => {
        const filtered = prev.filter((id) => id !== currentReportId);
        if (numOfTags >= 2) {
          return [currentReportId, ...filtered];
        }
        return filtered;
      });
    } else {
      setTagsPerReport((prev) => {
        return prev.map((tags, index) =>
          index === currentReportId ? [...tags, tag] : tags
        );
      });

      setOrderOfReport((prev) => {
        if (
          prev[0] === currentReportId ||
          tagsPerReport[currentReportId].length < 1
        ) {
          return prev;
        }
        const filtered = prev.filter((id) => id !== currentReportId);
        return [currentReportId, ...filtered];
      });
    }
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
        <div>
          <SelectReport
            items={reports}
            currentReportId={currentReportId}
            setCurrentReport={setCurrentReportId}
          />
        </div>
        <div
          className={cn(
            'flex',
            'items-center',
            'justify-between',
            'w-full',
            'p-3'
          )}
        >
          <h1 className={cn('font-bold', 'text-lg')}>Events</h1>
          <div className={cn('flex', 'items-center', 'gap-2')}>
            <Button
              disabled={!tagsPerReport[currentReportId].length}
              onClick={handleClear}
              variant="secondary"
              size="sm"
            >
              Clear
            </Button>

            <Button asChild size="sm" variant="secondary">
              <Checkbox
                checked={allSelectedPerReports[currentReportId]}
                onCheckedChange={handleCheckedChange}
              />
            </Button>
          </div>
        </div>
      </div>
      {Object.entries(
        uniqueTagsWithCountForMultipleReport[currentReportId]
      ).map(([tag, { count, color }], index, arr) => {
        const selected = tagsPerReport[currentReportId].includes(tag);
        const isBefore =
          arr.findIndex((t) => t[0] === tagsPerReport[currentReportId].at(-1)) >
          index;
        return (
          <React.Fragment key={tag}>
            <div
              className={cn(
                'px-3',
                'py-2',
                'flex',
                'items-center',
                'w-full',
                'cursor-pointer',
                'gap-3',
                'border-l-8',
                'border-b',
                'transition-all',
                !selected && 'hover:bg-card/50',
                selected && 'bg-card',
                selected && 'hover:bg-card/75',
                !selected && isBefore && 'opacity-20',
                !selected && isBefore && 'pointer-events-none'
              )}
              title={tag}
              onClick={() => handleEventClick(tag)}
              style={{
                borderLeftColor: color,
              }}
            >
              <div className={cn('w-full', 'min-w-0')}>
                <p className="block w-full mb-1 truncate">{tag}</p>
                <p className={cn('text-sm', 'text-muted-foreground')}>
                  Occurrences: {count}
                </p>
              </div>
              <Checkbox
                checked={tagsPerReport[currentReportId].includes(tag)}
                className="shrink-0"
              />
            </div>
          </React.Fragment>
        );
      })}
      {reports.length > 1 ? (
        <div className={cn('flex', 'items-center', 'justify-center', 'mt-12')}>
          <Button
            disabled={disableComparisonCTA}
            onClick={handleCompare}
            size="lg"
            variant={'outline'}
            className={cn('border-primary')}
          >
            Compare Reports
          </Button>
        </div>
      ) : null}
    </aside>
  );
};
