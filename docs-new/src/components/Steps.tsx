import React from 'react';

interface StepsProps {
  children: React.ReactNode;
}

export function Steps({ children }: StepsProps): JSX.Element {
  return (
    <div className="steps-container">
      <ol className="steps-list">{children}</ol>
    </div>
  );
}
