import React, { useEffect, useState } from 'react';
import { EmptyPage } from './EmptyPage';
import VisualizePage from './VisualizePage';
import type { IData } from '../App.interface';
import TimeLineSelector from './TimelineSelector';
import { baseURL } from '../App.utility';

const Home: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [data, setData] = useState<IData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseURL}/api/log`);
        const data = await res.json();
        // const data = require('../../../generated-perf-reports/log.json');
        setData(data);
      } catch (_) {
        setData([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(selectedTags);
  }, [selectedTags]);

  if (data.length === 0) {
    return <></>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <TimeLineSelector
        data={data}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
      {selectedTags.length === 2 ? (
        <VisualizePage
          data={data ?? []}
          startMarker={selectedTags[0] ?? ''}
          endMarker={selectedTags[1] ?? ''}
        />
      ) : (
        <EmptyPage />
      )}
      <div className="fixed bottom-4 right-4 text-sm text-gray-600">
        Powered by{' '}
        <a
          href="https://github.com/dream-sports-labs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          DreamSportsLabs
        </a>
      </div>
    </div>
  );
};

export default Home;
