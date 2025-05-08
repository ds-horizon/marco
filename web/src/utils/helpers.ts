export function randomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * (80 - 30 + 1) + 30);
  const l = Math.floor(Math.random() * (80 - 30 + 1) + 30);
  return `hsl(${h}deg, ${s}%, ${l}%)`;
}

const segmentedChartLabels = {
  start_event: 'Start Event',
  end_event: 'End Event',
  mean: 'Mean (ms)',
  standard_deviation: 'Standard Deviation',
  error_rate: 'Error Rate (%)',
} as const;

type SegmentedChartKeys = keyof typeof segmentedChartLabels;

export type MetricData<T = string> = {
  [key in SegmentedChartKeys]: T;
};

export const metricColumns = Object.entries(segmentedChartLabels).map(
  ([key, label]) => ({
    accessorKey: key,
    header: label,
  })
);

export const showEmptyPage = (tagsPerReport: string[][]) => {
  let shouldShowEmptyPage = true;
  tagsPerReport.forEach((tags) => {
    if (tags.length >= 2) {
      shouldShowEmptyPage = false;
    }
  });
  return shouldShowEmptyPage;
};

const comparisonChartLabels = {
  report: 'Report',
  ...segmentedChartLabels,
} as const;

type ComaprisonChartKeys = keyof typeof comparisonChartLabels;

export type ComaprisonMetricData<T = string> = {
  [key in ComaprisonChartKeys]: T;
};

export const comaprisonMetricColumns = Object.entries(
  comparisonChartLabels
).map(([key, label]) => ({
  accessorKey: key,
  header: label,
}));
