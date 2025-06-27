import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';
import { cn } from '~/utils/cn';

interface SegmentedBarChartProps {
  config: ChartConfig;
  formattedData: (Record<string, number> & {
    itr: number;
    total: number;
  })[];
  uniqueTagsWithCount: {
    [key: string]: {
      count: number;
      color: string;
    };
  };
  tags: string[];
}

export const SegmentedBarChart = ({
  formattedData,
  tags,
  uniqueTagsWithCount,
  config,
}: SegmentedBarChartProps) => {
  // function roundToNiceMax(value: number): number {
  //   if (value <= 1000) return Math.ceil(value / 100) * 100;
  //   if (value <= 5000) return Math.ceil(value / 500) * 500;
  //   if (value <= 10000) return Math.ceil(value / 1000) * 1000;
  //   if (value <= 50000) return Math.ceil(value / 5000) * 5000;
  //   return Math.ceil(value / 10000) * 10000;
  // }
  // const maxValue = Math.max(...formattedData.map((d) => d.total));
  // const roundedMax = roundToNiceMax(maxValue);
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
        <ChartLegend content={<ChartLegendContent className="flex-wrap" />} />
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
  );
};
