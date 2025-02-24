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
const dataDirs = ['mock/native_load_time.json', 'mock/js_load_time.json'];

const basePath1 =
  process.env.NODE_ENV === 'development'
    ? '/mock/log.json' // Dev mode (served by dev server)
    : 'assets/log.json'; // Prod mode (bundled into `dist`)

try {
  data = await fetch(basePath1)
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
};

const reports = [
  {
    name: 'Native Bottom Tab Load Time',
    tags: ['Native_Tab_Load_Start', 'Native_Tab_Load_End'],
    source: 'mock/native_load_time.json',
    color: randomColor(),
  },
  {
    name: 'JS Bottom Tab Load Time',
    tags: ['JS_Tab_Load_Start', 'JS_Tab_Load_End'],
    source: 'mock/js_load_time.json',
    color: randomColor(),
  },
];

export const visualiseMultipleReports = async (tagsPerReport: string[][]) => {
  const multipleBarChartConfig: {
    [key: string]: {
      label: string;
      color: string;
    };
  } = {};
  let maxIterationPossible = 0;
  const reportWithDataAndPattern: any[] = [];
  for (let i = 0; i < reports.length; i++) {
    const report = reports[i];
    const data = await fetchDataFromSource(report.source);
    const pattern = findPatterns(data, report.tags);
    const newReport = {
      ...report,
      data: data,
      pattern: pattern,
    };
    reportWithDataAndPattern.push(newReport);
    const key = newReport.name.split(' ').join('_');
    multipleBarChartConfig[key] = {
      label: newReport.name,
      color: newReport.color,
    };
    const patternValues = Object.values(pattern);
    const max = patternValues.length
      ? Math.min(...Object.values(pattern).map((p) => p.length))
      : 0;
    maxIterationPossible = Math.max(maxIterationPossible, max);
  }

  console.log(
    '::: Modified Report with Patter and Data',
    reportWithDataAndPattern
  );

  console.log(
    'Multiple Bar Chart Config',
    multipleBarChartConfig,
    maxIterationPossible
  );

  const finalData: Record<string, string>[] = [];
  for (let i = 0; i < maxIterationPossible; i++) {
    const markers: Record<string, string> = {};
    Object.keys(multipleBarChartConfig).forEach((label, index) => {
      // console.log('label in progress', label);
      const report = reportWithDataAndPattern.find(
        (value) => value.name === multipleBarChartConfig[label].label
      );
      // console.log('label found ', report.name);
      const diff =
        report['pattern'][report['tags'][1]][i] -
        report['pattern'][report['tags'][0]][i];
      markers[label] = diff.toString();
    });
    finalData.push({
      itr: (i + 1).toString(),
      ...markers,
    });
  }
  console.log('final data', finalData);
  return {
    chartConfig: multipleBarChartConfig,
    multipleData: finalData,
  };
};

export function useData(): PerformanceData {
  return data;
}

export function useDataEntry(index: number): PerformanceDataEntry | undefined {
  return data[index];
}
