import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './ui/chart';
import { cn } from '~/utils/cn';

interface StackedBarChartProps {
    config: ChartConfig
    formattedData: (Record<string, number>)[]
    uniqueTagsWithCount: {
        [key: string]: {
            count: number;
            color: string;
        };
    }
    tags: string[]
}

export const StackedBarChart = ({config, formattedData, tags, uniqueTagsWithCount}: StackedBarChartProps) => {
    return (
        <ChartContainer
        config={config}
        className={cn('min-h-[200px]', 'h-[60vh]', 'w-full')}
      >
        <BarChart accessibilityLayer data={formattedData}>
          <CartesianGrid vertical horizontal />
          <YAxis dataKey="total" />
          <XAxis dataKey="itr" />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend
            content={<ChartLegendContent className="flex-wrap" />}
          />
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
    )
}