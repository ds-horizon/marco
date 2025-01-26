import { type IData, type PerformanceData } from './App.interface';

export const baseURL = window.location.origin;

export const getAutoSuggestionMarkers = (rawData: IData[]): string[] => {
  const uniqueMarkers = new Set<string>();
  rawData.forEach((data) => {
    uniqueMarkers.add(data.tagName);
  });
  return Array.from(uniqueMarkers);
};

export function calculateMetrics(differences: PerformanceData[], mean: number) {
  const n = differences.length;

  // Calculate Standard Deviation (SD)
  const variance =
    differences.reduce(
      (sum, value) => sum + Math.pow(value.duration - mean, 2),
      0
    ) / n;
  const standardDeviation = Math.sqrt(variance);

  // Calculate Standard Error (SE)
  const standardError = standardDeviation / Math.sqrt(n);

  // Calculate 95% Confidence Interval (CI)
  const marginOfError = 1.96 * standardError; // 1.96 for 95% confidence level
  const lowerBound = mean - marginOfError;
  const upperBound = mean + marginOfError;

  // Calculate Error Rate as percentage
  const errorRate = (marginOfError / mean) * 100;

  return {
    std: standardDeviation.toFixed(2),
    errorRate: errorRate.toFixed(2),
    confidenceInterval: {
      lowerBound: lowerBound.toFixed(2),
      upperBound: upperBound.toFixed(2),
    },
  };
}

export const calculateDifferences = (
  data: IData[],
  startTag: string,
  endTag: string
): PerformanceData[] => {
  const differences: PerformanceData[] = [];
  let count = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i]?.tagName !== startTag) continue;

    // Found a start tag, look for the closest end tag
    for (let j = i + 1; j < data.length; j++) {
      if (data[j]?.tagName === startTag) {
        // If another start tag is encountered, move to this position and restart
        i = j - 1; // `-1` because outer loop will increment `i`
        break;
      }

      if (data[j]?.tagName === endTag) {
        // Found the corresponding end tag
        count++;
        differences.push({
          iteration: count,
          startMarker: data[i]?.timestamp.toString() ?? '',
          endMarker: data[j]?.timestamp.toString() ?? '',
          duration:
            parseInt(data[j]?.timestamp?.toString() ?? '0', 10) -
            parseInt(data[i]?.timestamp?.toString() ?? '0', 10),
        });
        i = j; // Skip ahead to the end tag's position
        break;
      }
    }
  }

  return differences;
};

export const calculateStats = (simulatedData: PerformanceData[]) => {
  // Calculate statistics
  const mean =
    simulatedData.reduce((sum, item) => sum + item.duration, 0) /
    simulatedData.length;

  const { std, errorRate } = calculateMetrics(simulatedData, mean);

  return { mean, standardDeviation: std, errorRate };
};
