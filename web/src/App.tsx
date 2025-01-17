import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { cn } from '~/utils/cn';
import { findPatterns, tagWiseCount } from '~/utils/data';

import { useData } from './data';
import { Header } from './header';
import React, { useState } from 'react';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

export function App() {
  const data = useData();
  const uniqueTagsWithCount = tagWiseCount(data);
  const [tags, setTags] = useState<string[]>([]);

  const chartConfig = tags.reduce(
    (acc, tag, index) => ({
      ...acc,
      [`chart-${index}`]: {
        label: tag,
        color: `hsl(var(--color-${index + 1}))`,
      },
    }),
    {}
  );

  const pattern = findPatterns(data, tags);
  const patternValues = Object.values(pattern);
  const max = patternValues.length
    ? Math.min(...Object.values(pattern).map((p) => p.length))
    : 0;

  const chartData = Array.from({ length: max || 0 }).map((_, index) => ({
    itr: index + 1,
    ...tags.reduce(
      (acc, tag) => ({
        ...acc,
        [tag]: pattern[tag][index],
      }),
      {}
    ),
  }));

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
            'p-2',
            'h-full',
            'overflow-x-hidden',
            'overflow-y-auto',
            'sticky',
            'top-0',
            'left-0',
            'z-40',
            'py-24'
          )}
        >
          {Object.entries(uniqueTagsWithCount).map(
            ([tag, count], index, arr) => (
              <React.Fragment key={tag}>
                <Card
                  className={cn(
                    'cursor-pointer',
                    'hover:border-white',
                    'transition-colors',
                    tags.includes(tag) && 'border-green-500',
                    tags.includes(tag) && 'hover:border-green-500'
                  )}
                  onClick={() => {
                    if (tags.includes(tag)) {
                      setTags(tags.filter((t) => t !== tag));
                    } else {
                      setTags([...tags, tag]);
                    }
                  }}
                >
                  <CardHeader>
                    <CardTitle className={cn('truncate')} title={tag}>
                      {tag}
                    </CardTitle>
                    <CardDescription>Occurrences: {count}</CardDescription>
                  </CardHeader>
                </Card>
                {index !== arr.length - 1 && (
                  <div className={cn('w-px', 'h-7', 'bg-card', 'ml-4')} />
                )}
              </React.Fragment>
            )
          )}
        </aside>
        <main className={cn('overflow-x-hidden', 'overflow-y-auto', 'pt-20')}>
          {tags.length > 1 && (
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis dataKey="itr" />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                {tags.map((tag, index) => (
                  <Bar
                    dataKey={tag}
                    stackId={'a'}
                    fill={`hsl(var(--chart-${index + 1}))`}
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
          )}
          <code>
            <pre>
              {tags.length > 1
                ? JSON.stringify(
                    data.filter((o) => tags.includes(o.tagName)),
                    null,
                    2
                  )
                : 'Select at least TWO tags..'}
            </pre>
          </code>
        </main>
      </div>
    </>
  );
}
