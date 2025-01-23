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

export type MetricData<T = any> = {
  [key in MetricKey]: T;
};

export const metricColumns = Object.entries(metricKeys).map(([key, label]) => ({
  accessorKey: key,
  header: label,
}));
