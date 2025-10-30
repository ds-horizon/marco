import React from 'react';

interface CardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export function Card({ title, icon, children }: CardProps): JSX.Element {
  return (
    <div className="card-container">
      <div className="card-header">
        {icon && <span className="card-icon">{icon}</span>}
        <h3>{title}</h3>
      </div>
      <div className="card-content">{children}</div>
    </div>
  );
}

interface CardGridProps {
  children: React.ReactNode;
}

export function CardGrid({ children }: CardGridProps): JSX.Element {
  return <div className="card-grid">{children}</div>;
}
