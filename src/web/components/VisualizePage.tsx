import React from 'react';
import PerformanceVisualization from './PerformanceVisualization';
import type { IData } from '../App.interface';

interface VisualizationPageProps {
  startMarker: string;
  endMarker: string;
  data: IData[];
}

const VisualizePage: React.FC<VisualizationPageProps> = ({
  startMarker,
  endMarker,
  data,
}) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Performance Visualization
      </h1>
      <PerformanceVisualization
        startMarker={startMarker}
        endMarker={endMarker}
        data={data}
      />
    </main>
  );
};

export default VisualizePage;
