import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface FallbackPageProps {
  startMarker: string;
  endMarker: string;
}

const FallbackPage: React.FC<FallbackPageProps> = ({ startMarker, endMarker }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-red-600">Visualization Not Possible</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Unable to calculate data for the selected markers:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Start Marker: {startMarker}</li>
            <li>End Marker: {endMarker}</li>
          </ul>
          <p className="text-center mb-4">
            This combination of markers may not have any associated data or may be in an invalid order.
          </p>
          <div className="flex justify-center">
            <Link
              to="/"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Back to Form
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FallbackPage;

