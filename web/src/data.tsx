import { report } from 'process';
import { findPatterns } from './utils/data';
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

      return s.map((entry: any) => ({
        ...entry,
        timestamp: Number(entry.timestamp),
        color: colors[entry.tagName],
      }));
    });
} catch (error) {
  console.error(error);
  throw new Error('Failed to load performance data at path assets/log.json');
}

export const fetchDataFromSource = async (path: string) => {
  try {
    const d = await fetch(path)
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
        return s.map((entry: any) => ({
          ...entry,
          timestamp: Number(entry.timestamp),
          color: colors[entry.tagName],
        }));
      });
    return d;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to load performance data at path assets/log.json');
  }
}

export const visualiseMultipleReports = async () => {
  const reports = [
    {
      name: 'Native Bottom Tab Load Time',
      tags: ['native_tabs_open_benchmark', 'native_tabs_load_time'],
      source: 'mock/native_load_time.json',
      color: randomColor()
    },
    {
      name: 'JS Bottom Tab Load Time',
      tags: ['js_tabs_open_benchmark', 'js_tabs_load_time'],
      source: 'mock/js_load_time.json',
      color: randomColor()
    }
  ]

  const multipleBarChartConfig: {
    [key: string]: {
      label: string
      color: string
    }
  } = {};
  let maxIterationPossible = 0;

  for (let i=0; i< reports.length; i++) {
    const report = reports[i];
    const data = await fetchDataFromSource(report.source)
    const pattern = findPatterns(data, report.tags)
    
    const key = report.name.split(" ").join("_")
    multipleBarChartConfig[key] = {
      label: report.name,
      color: report.color
    }
    const patternValues = Object.values(pattern);
    const max = patternValues.length
      ? Math.min(...Object.values(pattern).map((p) => p.length))
      : 0;
    maxIterationPossible = Math.max(maxIterationPossible, max)
  }

  console.log('Multiple Bar Chart Config', multipleBarChartConfig, maxIterationPossible)
  return {
    multipleBarChartConfig,
    maxIterationPossible
  }
}

const createMultipleBarChartData = () => {
  const finalData : Record<string, string>[] = [];
  const {multipleBarChartConfig, maxIterationPossible} = visualiseMultipleReports()
  for (let i=0; i< maxIterationPossible; i++) {
    finalData.push({
      itr: i+1,

    })
  }
  return finalData;
}

export function useData(): PerformanceData {
  return data;
}

export function useDataEntry(index: number): PerformanceDataEntry | undefined {
  return data[index];
}
