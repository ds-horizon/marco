import { cn } from '~/utils/cn';
import {
  calculateMetrics,
  findPatterns,
  tagWiseCountAndColor,
} from '~/utils/data';

import React, { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Button } from './components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './components/ui/chart';
import { Checkbox } from './components/ui/checkbox';
import { useData } from './data';
import { Header } from './header';
import { MetricData, metricColumns } from './utils/helpers';
import { DataTable } from './components/data-table';

export function App() {
  const data = useData();
  const uniqueTagsWithCount = useMemo(() => tagWiseCountAndColor(data), [data]);
  const [tags, setTags] = useState<string[]>(
    new URL(window.location.href).searchParams.get('tags')?.split(',') || []
  );

  const config = useMemo<ChartConfig>(
    () =>
      tags.reduce(
        (acc, tag) => ({
          ...acc,
          [tag]: {
            label: tag,
          },
        }),
        {}
      ),
    [tags]
  );

  const { formattedData, metrics } = useMemo(() => {
    const pattern = findPatterns(data, tags);
    const patternValues = Object.values(pattern);
    const max = patternValues.length
      ? Math.min(...Object.values(pattern).map((p) => p.length))
      : 0;

    const formattedData = Array.from({ length: max }).map<
      Record<string, number> & {
        itr: number;
        total: number;
      }
    >((_, index) => ({
      itr: index + 1,
      ...tags.reduce(
        (acc, tag, i) => {
          const current =
            i > 0 ? pattern[tag][index] - pattern[tags[i - 1]][index] : 0;
          return {
            ...acc,
            [tag]: current,
            total: acc.total + current,
          };
        },
        {
          total: 0,
        }
      ),
    }));

    let metrics: MetricData<string>[] = [];

    tags.forEach((tag, i) => {
      if (i > 0) {
        const d = formattedData.reduce((acc, obj) => {
          acc.push(obj[tag]);
          return acc;
        }, []);
        const { mean, std, errorRate } = calculateMetrics(d);
        metrics.push({
          mean: mean.toFixed(1),
          standard_deviation: std.toFixed(2),
          error_rate: errorRate.toFixed(2),
          start_event: tags[i - 1],
          end_event: tags[i],
        });
      }
    });

    return {
      formattedData,
      metrics,
    };
  }, [data, tags]);

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
            ([tag, { count, color }], index, arr) => {
              const selected = tags.includes(tag);
              const isBefore =
                arr.findIndex((t) => t[0] === tags.at(-1)) > index;

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
                <ChartContainer
                  config={config}
                  className={cn('min-h-[200px]', 'h-[60vh]', 'w-full')}
                >
                  <BarChart accessibilityLayer data={formattedData}>
                    <CartesianGrid vertical horizontal />
                    <YAxis dataKey="total" />
                    <XAxis dataKey="itr" />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <ChartLegend content={<ChartLegendContent />} />
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

              <DataTable columns={metricColumns} data={metrics} />

              <h1 className="mt-12 mb-4 text-xl font-bold">
                <span className="px-2 py-1 rounded-full bg-card">
                  {formattedData.length}
                </span>{' '}
                Total iterations
              </h1>
              <div
                className={cn(
                  'grid',
                  'grid-flow-row',
                  'gap-4',
                  'grid-cols-[max-content,1fr]',
                  'overflow-x-auto',
                  'items-center',
                  'py-8',
                  'bg-card/25',
                  'rounded-lg'
                )}
              >
                {formattedData.map((d, index) => (
                  <>
                    <div
                      className={cn(
                        'bg-gradient-to-r',
                        'from-background',
                        'via-background',
                        'via-60%',
                        'to-transparent',
                        'flex',
                        'items-center',
                        'gap-2',
                        'pr-8',
                        'sticky',
                        'left-0',
                        'pl-4'
                      )}
                    >
                      <span className="p-4 rounded-lg bg-card justify-self-center">
                        {index + 1}
                      </span>
                      <div
                        className={cn(
                          'grid',
                          'grid-flow-row',
                          'gap-1',
                          'text-xs'
                        )}
                      >
                        <span className="text-muted-foreground">Total:</span>
                        <span>{d.total.toFixed(2)}ms</span>
                      </div>
                    </div>
                    <div className="flex items-center flex-nowrap">
                      {Object.entries(d)
                        .filter(([key]) => !['itr', 'total'].includes(key))
                        .map(([key, value], index) => (
                          <>
                            {index > 0 && (
                              <span
                                className={cn(
                                  'text-sm',
                                  'text-muted-foreground',
                                  'px-4',
                                  'border-b',
                                  'border-b-muted',
                                  'h-max'
                                )}
                              >
                                {value.toFixed(2)}ms
                              </span>
                            )}
                            <span
                              className={cn(
                                'bg-card',
                                'rounded-lg',
                                'p-4',
                                'justify-self-center'
                              )}
                            >
                              {key}
                            </span>
                          </>
                        ))}
                    </div>
                  </>
                ))}
              </div>
            </>
          ) : (
            <div
              className={cn(
                'bg-card/20',
                'p-4',
                'text-center',
                'rounded-lg',
                'mt-4',
                'min-h-full',
                'flex',
                'items-center',
                'justify-center',
                'text-2xl'
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
