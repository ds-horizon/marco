import { cn } from '~/utils/cn';
import {
  calculateStdAndErrRate,
  findPatterns,
  tagWiseCountAndColor,
} from '~/utils/data';

import React, { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, XAxis } from 'recharts';
import { DataTable } from './components/data-table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from './components/ui/chart';
import { Checkbox } from './components/ui/checkbox';
import { useData } from './data';
import { Header } from './header';
import { Button } from './components/ui/button';

const config = {};

export function App() {
  const data = useData();
  const uniqueTagsWithCount = useMemo(() => tagWiseCountAndColor(data), [data]);
  const [tags, setTags] = useState<string[]>(
    new URL(window.location.href).searchParams.get('tags')?.split(',') || []
  );

  const { formattedData, std, errorRate } = useMemo(() => {
    const pattern = findPatterns(data, tags);
    const patternValues = Object.values(pattern);
    const max = patternValues.length
      ? Math.min(...Object.values(pattern).map((p) => p.length))
      : 0;

    const formattedData = Array.from({ length: max }).map<
      Record<string, number> & {
        itr: number;
      }
    >((_, index) => ({
      itr: index + 1,
      ...tags.reduce(
        (acc, tag, i) => ({
          ...acc,
          [tag]: i > 0 ? pattern[tag][index] - pattern[tags[i - 1]][index] : 0,
        }),
        {}
      ),
    }));

    const { std, errorRate } = formattedData.reduce<{
      std: number;
      errorRate: number;
    }>(
      (acc, i) => {
        const raw = tags.map((tag) => i[tag]);
        const values = calculateStdAndErrRate(raw, max);

        return {
          std: acc.std + values.std,
          errorRate: acc.errorRate + values.errorRate,
        };
      },
      {
        std: 0,
        errorRate: 0,
      }
    );

    return {
      formattedData,
      std: std / max,
      errorRate: errorRate / max,
    };
  }, [data, tags]);

  const columns = useMemo(
    () =>
      tags.map((tag) => ({
        accessorKey: tag,
        header: tag.toUpperCase(),
      })),
    [tags]
  );

  useEffect(() => {
    const url = new URL(window.location.href);

    if (tags.length) {
      url.searchParams.set('tags', tags.join(','));
      window.history.pushState({}, '', url);
    } else {
      url.searchParams.delete('tags');
      window.history.pushState({}, '', url);
    }
  }, [tags]);

  return (
    <>
      <Header />
      <div
        className={cn(
          'grid',
          'grid-cols-[max-content,1fr]',
          'grid-rows-1',
          'w-full',
          'h-full'
        )}
      >
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
              'p-4',
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
              'gap-2'
            )}
          >
            <h1 className={cn('font-bold', 'text-lg')}>Events</h1>
            <Button
              disabled={!tags.length}
              onClick={() => setTags([])}
              variant="secondary"
              size="sm"
            >
              Clear
            </Button>
          </div>
          {Object.entries(uniqueTagsWithCount).map(
            ([tag, { count, color }]) => {
              const selected = tags.includes(tag);

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
                      'transition-colors',
                      !selected && 'hover:bg-card/50',
                      selected && 'bg-card',
                      selected && 'hover:bg-card/75'
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

                    <Checkbox
                      checked={tags.includes(tag)}
                      className="shrink-0"
                    />
                  </div>
                </React.Fragment>
              );
            }
          )}
        </aside>
        <main
          className={cn(
            'overflow-x-hidden',
            'overflow-y-auto',
            'py-24',
            'px-8'
          )}
        >
          {tags.length > 1 ? (
            <>
              <div className={cn('p-2', 'rounded-xl', 'bg-card', 'mt-4')}>
                <ChartContainer config={config} className={cn('min-h-96')}>
                  <BarChart accessibilityLayer data={formattedData}>
                    <CartesianGrid vertical horizontal />
                    <XAxis dataKey="itr" />
                    {/* <Tooltip /> */}
                    <Legend />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {/* <ChartLegend content={<ChartLegendContent />} /> */}
                    {tags.map((tag, index) => (
                      <Bar
                        key={tag}
                        dataKey={tag}
                        stackId={'a'}
                        fill={uniqueTagsWithCount[tag].color}
                        radius={
                          !index
                            ? [0, 0, 4, 4]
                            : index < tags.length - 1
                              ? [0, 0, 0, 0]
                              : [4, 4, 0, 0]
                        }
                      />
                    ))}
                  </BarChart>
                </ChartContainer>
              </div>

              <div
                className={cn(
                  'grid',
                  'grid-flow-col',
                  'my-4',
                  'gap-4',
                  'items-center'
                )}
              >
                <div
                  className={cn(
                    'bg-card',
                    'px-4',
                    'py-2',
                    'rounded-lg',
                    'grid',
                    'grid-flow-row'
                  )}
                >
                  <pre className="m-0 text-sm text-muted-foreground">
                    Standard deviation:
                  </pre>
                  <pre className="m-0 text-orange-500">{std.toFixed(2)}</pre>
                </div>

                <div
                  className={cn(
                    'bg-card',
                    'px-4',
                    'py-2',
                    'rounded-lg',
                    'grid',
                    'grid-flow-row'
                  )}
                >
                  <pre className="m-0 text-sm text-muted-foreground">
                    Error rate:
                  </pre>
                  <pre className="m-0 text-orange-500">
                    {errorRate.toFixed(2)}%
                  </pre>
                </div>
              </div>

              <DataTable columns={columns} data={formattedData} />
            </>
          ) : (
            <div
              className={cn(
                'bg-card',
                'p-4',
                'text-center',
                'rounded-lg',
                'mt-4'
              )}
            >
              Select at least {tags.length < 1 ? 'two tags' : 'one more tag'} to
              compare.
            </div>
          )}
        </main>
      </div>
    </>
  );
}
