import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChartIcon as ChartBar, Clock, Zap } from 'lucide-react';

export const EmptyPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-12 mt-6">
      <h1 className="text-5xl font-extrabold mb-12 text-center text-gray-800 tracking-tight">
        React Native <span className="text-blue-600">Performance Tracker</span>
      </h1>
      <Card className="bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl max-w-3xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-semibold flex items-center">
            <ChartBar className="mr-2" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-600 leading-relaxed mb-6">
            Gain insights into your React Native app's performance. Select two
            markers on the timeline above to visualize detailed performance data
            between those points.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center text-gray-700">
              <Clock className="mr-3 text-blue-500 flex-shrink-0" size={24} />
              <span>
                Measure load times and interactions with precision, allowing you
                to identify areas for optimization
              </span>
            </li>
            <li className="flex items-center text-gray-700">
              <Zap className="mr-3 text-blue-500 flex-shrink-0" size={24} />
              <span>
                Identify performance bottlenecks and track improvements over
                time as you optimize your app
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
};
