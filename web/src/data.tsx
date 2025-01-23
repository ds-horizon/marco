import { randomColor } from './utils/helpers';

export type PerformanceData = Array<PerformanceDataEntry>;

export type PerformanceDataEntry = {
  tagName: string;
  timestamp: number;
  color: string;
  meta?: Record<string, string>;
};

let data: PerformanceData = [];

try {
  data = await import('../../example/mock/log.json').then((s) => {
    const colors = s.default.reduce(
      (acc, { tagName }) => {
        if (!acc[tagName]) {
          acc[tagName] = randomColor();
        }

        return acc;
      },
      {} as {
        [key: string]: string;
      }
    );
    console.log('colors:', colors);
    return s.default.map((entry) => ({
      ...entry,
      timestamp: Number(entry.timestamp),
      color: colors[entry.tagName],
    }));
  });
  console.log('data:', data);
} catch (error) {
  console.error(error);
  throw new Error(
    'Failed to load performance data at path ../../example/mock/log.json'
  );
}

export function useData(): PerformanceData {
  return data;
}

export function useDataEntry(index: number): PerformanceDataEntry | undefined {
  return data[index];
}
