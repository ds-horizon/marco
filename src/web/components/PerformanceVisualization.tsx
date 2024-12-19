import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { calculateDifferences, calculateMetrics } from '../App.utility';
import { type PerformanceData } from '../App.interface';
import FallbackPage from './FallbackPage';

interface PerformanceStats {
  mean: number;
  standardDeviation: string;
  errorRate: string;
}

interface PerformanceVisualizationProps {
  startMarker: string;
  endMarker: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 rounded shadow">
        <p className="font-bold">Iteration {label}</p>
        <p>Start Marker: {data.startMarker}</p>
        <p>End Marker: {data.endMarker}</p>
        <p>Duration: {data.duration.toFixed(2)} ms</p>
      </div>
    );
  }
  return null;
};

const PerformanceVisualization: React.FC<PerformanceVisualizationProps> = ({
  startMarker,
  endMarker,
}) => {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [stats, setStats] = useState<PerformanceStats>({
    mean: 0,
    standardDeviation: '0',
    errorRate: '0',
  });
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  useEffect(() => {
    // Simulating data fetching based on start and end markers
    const fetchData = async () => {
      const res = await fetch('http://localhost:8083/log.json');
      const data = await res.json();
      const simulatedData: PerformanceData[] = calculateDifferences(
        data,
        startMarker,
        endMarker
      );

      setData(simulatedData);

      // Calculate statistics
      const mean =
        simulatedData.reduce((sum, item) => sum + item.duration, 0) /
        simulatedData.length;

      const { std, errorRate } = calculateMetrics(simulatedData, mean);

      setStats({ mean, standardDeviation: std, errorRate });
    };

    fetchData();
  }, [startMarker, endMarker]);

  const handleClick = (point: any) => {
    if (point && point.activePayload && point.activePayload.length > 0) {
      const index = data.findIndex(
        (item) => item.iteration === point.activePayload[0].payload.iteration
      );
      setSelectedPoint(index);
    }
  };
  if (data.length === 0) {
    return <FallbackPage startMarker={startMarker} endMarker={endMarker} />;
  }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-700">
              Mean
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-900">
              {stats.mean.toFixed(2)} ms
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-700">
              Standard Deviation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-900">
              {stats.standardDeviation} ms
            </p>
          </CardContent>
        </Card>
        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-700">
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-900">
              {stats.errorRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Performance Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                onClick={handleClick}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="iteration" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#8884d8"
                  name="Iteration"
                />
                {selectedPoint !== null && data[selectedPoint] && (
                  <ReferenceDot
                    x={data[selectedPoint]?.iteration}
                    y={data[selectedPoint]?.duration}
                    r={5}
                    fill="#8884d8"
                    stroke="none"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Results for {startMarker} & {endMarker}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                    Iteration
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                    Start Marker
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                    End Marker
                  </th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                    Duration (ms)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.iteration} className="hover:bg-gray-50">
                    <td className="border-b border-gray-300 px-4 py-2">
                      {item.iteration}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2">
                      {item.startMarker}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2">
                      {item.endMarker}
                    </td>
                    <td className="border-b border-gray-300 px-4 py-2">
                      {item.duration.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceVisualization;
