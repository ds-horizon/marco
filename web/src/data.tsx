import { randomColor } from './utils/helpers';

export type PerformanceData = Array<PerformanceDataEntry>;

export type PerformanceDataEntry = {
  tagName: string;
  timestamp: number;
  color: string;
  meta?: Record<string, string>;
};

let data: PerformanceData = [];

const basePath =
  process.env.NODE_ENV === 'development'
    ? '/mock/log.json' // Dev mode (served by dev server)
    : 'assets/log.json'; // Prod mode (bundled into `dist`)

try {
  data = await fetch(basePath)
    .then((res) => res.json())
    .then((s) => {
      const colors = s.reduce(
        (acc: any, { tagName }: { tagName: any }) => {
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
      return s.map((entry: any) => ({
        ...entry,
        timestamp: Number(entry.timestamp),
        color: colors[entry.tagName],
      }));
    });
  console.log('data:', data);
} catch (error) {
  console.error(error);
  throw new Error('Failed to load performance data at path assets/log.json');
}

export function useData(): PerformanceData {
  return data;
}

export function useDataEntry(index: number): PerformanceDataEntry | undefined {
  return data[index];
}
