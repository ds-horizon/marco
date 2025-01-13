export type PerformanceData = Array<PerformanceDataEntry>;

export type PerformanceDataEntry = {
  tagName: string;
  timestamp: number;
  meta?: Record<string, string>;
};

let data: PerformanceData = [];

try {
  data = await import('../../example/mock/log.json').then((s) => s.default);
} catch (error) {
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
