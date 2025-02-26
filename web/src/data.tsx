import { findPatterns } from './utils/data';
import { randomColor } from './utils/helpers';

export type PerformanceData = Array<PerformanceDataEntry>;

export type PerformanceDataEntry = {
  tagName: string;
  timestamp: number;
  color: string;
  meta?: Record<string, string>;
};

export type ReportType = {
  reportName: string;
  reportPath: string;
  reportKey: string;
};

export type MultipleReportData = ReportType & { data: PerformanceData };

const data: MultipleReportData[] = [];

const manifestPath =
  process.env.NODE_ENV === 'development'
    ? '/mock/manifest.json' // Dev mode (served by dev server)
    : '/assets/manifest.json'; // Prod mode (bundled into `dist`)

export const fetchDataFromSource = async (
  path: string
): Promise<PerformanceData> => {
  try {
    const d = await fetch(path)
      .then((res) => res.json())
      .then((s) => {
        const colors = s.reduce(
          (
            acc: {
              [key: string]: string;
            },
            { tagName }: { tagName: string }
          ) => {
            if (!acc[tagName]) {
              acc[tagName] = randomColor();
            }

            return acc;
          },
          {} as {
            [key: string]: string;
          }
        );
        return s.map((entry: { [key: string]: string }) => ({
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

try {
  // Fetch manifest.json first
  const manifestResponse = await fetch(manifestPath);
  if (!manifestResponse.ok) throw new Error('Failed to load manifest.json');

  const manifest = await manifestResponse.json();
  const basePaths: string[] = manifest.reports.map(
    (report: { path: string }) => report.path
  ); // Extract paths from manifest

  for (let i = 0; i < basePaths.length; i++) {
    const d = await fetchDataFromSource(basePaths[i]);
    data.push({
      reportName: manifest.reports[i]?.reportName || `Report ${i + 1}`,
      reportKey: `report-${i + 1}`,
      reportPath: basePaths[i],
      data: d,
    });
  }
} catch (error) {
  console.error(error);
  throw new Error('Failed to load performance data at path assets/log.json');
}

export type IComparisonBarChartData = Record<string, string>[];
export type IComparisonBarCharConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

export const visualiseMultipleReports = (tagsPerReport: string[][], selectedReportsOrder: number[]) => {
  const multipleBarChartConfig: IComparisonBarCharConfig = {};
  let maxIterationPossible = 0;
  const reportWithDataAndPattern: {
    name: string;
    data: MultipleReportData[];
    pattern: {
      [key: string]: number[];
    };
    tags: string[];
    color: string;
  }[] = [];
  for (let i = 0; i < data.length; i++) {
  
    if (!selectedReportsOrder.includes(i)) continue;

    const reportInfo = data[i];
    const numberOfTags = tagsPerReport[i].length;
    const tags = [tagsPerReport[i][0], tagsPerReport[i][numberOfTags - 1]];
    const pattern = findPatterns(reportInfo.data, tags);
    const newReport = {
      name: reportInfo.reportName,
      data: data,
      pattern: pattern,
      tags: tags,
      color: randomColor(),
    };
    reportWithDataAndPattern.push(newReport);
    const key = reportInfo.reportName;
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

  const finalData: IComparisonBarChartData = [];
  const metrics: Record<
    string,
    {
      diff: number[];
      tags: string[];
    }
  > = {};
  for (let i = 0; i < maxIterationPossible; i++) {
    const markers: Record<string, string> = {};
    Object.keys(multipleBarChartConfig).forEach((label) => {
      const report = reportWithDataAndPattern.find(
        (value) => value.name === multipleBarChartConfig[label].label
      );
      if (report) {
        const diff =
          report['pattern'][report['tags'][1]][i] -
          report['pattern'][report['tags'][0]][i];
        markers[label] = diff.toString();
        if (metrics[label]) {
          metrics[label].diff.push(diff);
        } else {
          metrics[label] = {
            diff: [Number(diff)],
            tags: report['tags'],
          };
        }
      }
    });
    finalData.push({
      itr: (i + 1).toString(),
      ...markers,
    });
  }
  return {
    chartConfig: multipleBarChartConfig,
    multipleData: finalData,
    metrics,
  };
};

export function useReportEntries(): MultipleReportData[] {
  return data;
}
