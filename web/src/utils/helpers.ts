export function randomColor() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * (80 - 30 + 1) + 30);
  const l = Math.floor(Math.random() * (80 - 30 + 1) + 30);
  return `hsl(${h}deg, ${s}%, ${l}%)`;
}

const metricKeys = {
  start_event: 'Start Event',
  end_event: 'End Event',
  mean: 'Mean (ms)',
  standard_deviation: 'Standard Deviation',
  error_rate: 'Error Rate (%)',
} as const;

type MetricKey = keyof typeof metricKeys;

export type MetricData<T = string> = {
  [key in MetricKey]: T;
};

export const metricColumns = Object.entries(metricKeys).map(([key, label]) => ({
  accessorKey: key,
  header: label,
}));

export const showEmptyPage = (tagsPerReport: string[][]) => {
  let shouldShowEmptyPage = true;
  tagsPerReport.forEach((tags) => {
    if (tags.length >= 2) {
      shouldShowEmptyPage = false;
    }
  });
  return shouldShowEmptyPage;
};

const comparisonMetricKeys = {
  report: 'Report',
  ...metricKeys,
} as const;

type ComaprisonMetricKey = keyof typeof comparisonMetricKeys;

export type ComaprisonMetricData<T = string> = {
  [key in ComaprisonMetricKey]: T;
};

export const comaprisonMetricColumns = Object.entries(comparisonMetricKeys).map(
  ([key, label]) => ({
    accessorKey: key,
    header: label,
  })
);
