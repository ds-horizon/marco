import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import PerformanceVisualization from './PerformanceVisualization';

const VisualizePage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const start = searchParams.get('start') || '';
  const end = searchParams.get('end') || '';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Performance Visualization</h1>
      <PerformanceVisualization startMarker={start} endMarker={end} />
      <Link to="/" className="mt-8 text-blue-500 hover:text-blue-700 font-semibold">
        Back to Form
      </Link>
    </main>
  );
}

export default VisualizePage;

