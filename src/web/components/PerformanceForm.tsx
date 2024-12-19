import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AutocompleteInput from './AutocompleteInput';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { getAutoSuggestionMarkers } from '../App.utility';

const PerformanceForm: React.FC = () => {
  const [startMarker, setStartMarker] = useState('');
  const [endMarker, setEndMarker] = useState('');
  const [data, setData] = useState<
    {
      tagName: string;
      timestamp: number;
    }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8083/log.json');
        const data = await res.json();
        setData(data);
      } catch (_) {
        setData([]);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <></>;
  }

  const suggestions = getAutoSuggestionMarkers(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startMarker && endMarker && startMarker !== endMarker) {
      navigate(
        `/visualize?start=${encodeURIComponent(startMarker)}&end=${encodeURIComponent(endMarker)}`
      );
    }
  };

  const isSubmitDisabled =
    !startMarker || !endMarker || startMarker === endMarker;

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Performance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AutocompleteInput
            label="Start Marker"
            value={startMarker}
            onChange={setStartMarker}
            suggestions={suggestions}
          />
          <AutocompleteInput
            label="End Marker"
            value={endMarker}
            onChange={setEndMarker}
            suggestions={suggestions}
          />
          <button
            type="submit"
            className={`w-full font-bold py-2 px-4 rounded transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${
              isSubmitDisabled
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-700 text-white'
            }`}
            disabled={isSubmitDisabled}
          >
            Visualize
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PerformanceForm;
