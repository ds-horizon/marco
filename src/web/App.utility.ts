import { type PerformanceData } from "./App.interface"

type RawDataType = {
    tagName: string,
    timestamp: number
}[]

export const getAutoSuggestionMarkers = (rawData: RawDataType): string[] => {
  const uniqueMarkers = new Set<string>();
  rawData.forEach(data => {
    uniqueMarkers.add(data.tagName)
  })
  return Array.from(uniqueMarkers)
}

export function calculateMetrics(differences: PerformanceData[], mean: number) {
    const n = differences.length;
  
    // Calculate Standard Deviation (SD)
    const variance =
      differences.reduce((sum, value) => sum + Math.pow(value.duration - mean, 2), 0) / n;
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

export const calculateDifferences = (data: RawDataType, startTag: string, endTag: string): PerformanceData[] => {
    let differences: PerformanceData[] = [];
    let count = 1;
    let isStartTagFound = false;
    let isEndTagFound = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i]?.tagName === endTag) {
        isEndTagFound = true;
        if (!isStartTagFound && isEndTagFound) break;
      }

      if (data[i]?.tagName === startTag) {
        isStartTagFound = true;
        // Find the corresponding end tag
        for (let j = i + 1; j < data.length; j++) {
          if (data[j]?.tagName === endTag) {
            differences.push({
                iteration: count,
                startMarker:  parseInt(data[i]?.timestamp?.toString() ?? "", 10).toString(), 
                endMarker:  parseInt(data[j]?.timestamp.toString() ?? "", 10).toString(),
                duration: parseInt(data[j]?.timestamp.toString() ?? "", 10) - parseInt(data[i]?.timestamp.toString() ?? "", 10)
            });
            count++;
            break;
          }
        }
      }
    }
    return differences;
}