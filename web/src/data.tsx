export type PerformanceData = Array<PerformanceDataEntry>;

export type PerformanceDataEntry = {
  tagName: string;
  timestamp: number;
  meta?: Record<string, string>;
};

let data: PerformanceData = [];

try {
  data = await import('../../example/mock/log.json');
} catch (error) {
  throw new Error(
    'Failed to load performance data at path ../../example/mock/log.json'
  );
}

export function useData(index?: number) {
  if (typeof index === 'number' && index > -1) {
    return data[index];
  }

  return data;
}
