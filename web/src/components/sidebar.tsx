import React from 'react';
import { cn } from '~/utils/cn';
import { Button } from './ui/button';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from './ui/checkbox';

interface SideBarProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  allSelected: CheckedState;
  setAllSelected: React.Dispatch<React.SetStateAction<CheckedState>>;
  uniqueTagsWithCount: {
    [key: string]: {
      count: number;
      color: string;
    };
  };
}

export const SideBar = ({
  tags,
  setTags,
  allSelected,
  setAllSelected,
  uniqueTagsWithCount,
}: SideBarProps) => {
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
          'items-center',
          'justify-between',
          'gap-2',
          'z-40'
        )}
      >
        <h1 className={cn('font-bold', 'text-lg')}>Events</h1>
        <div
          className={cn(
            'grid',
            'grid-flow-col',
            'gap-2',
            'items-center',
            'shrink-0'
          )}
        >
          <Button
            disabled={!tags.length}
            onClick={() => setTags([])}
            variant="secondary"
            size="sm"
          >
            Clear
          </Button>

          <Button asChild size="sm" variant="secondary">
            <Checkbox checked={allSelected} onCheckedChange={setAllSelected} />
          </Button>
        </div>
      </div>
      {Object.entries(uniqueTagsWithCount).map(
        ([tag, { count, color }], index, arr) => {
          const selected = tags.includes(tag);
          const isBefore = arr.findIndex((t) => t[0] === tags.at(-1)) > index;

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
                onClick={() => {
                  if (tags.includes(tag)) {
                    setTags(tags.filter((t) => t !== tag));
                  } else {
                    setTags([...tags, tag]);
                  }
                }}
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

                <Checkbox checked={tags.includes(tag)} className="shrink-0" />
              </div>
            </React.Fragment>
          );
        }
      )}
    </aside>
  );
};
