import React from 'react';
import PerformanceForm from './PerformanceForm';

const Home: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">React Native Performance Tracker</h1>
      <PerformanceForm />
    </main>
  );
}

export default Home;

