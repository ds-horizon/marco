import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`} {...props} />
);

export const CardHeader: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={`px-6 py-4 border-b ${className}`} {...props} />
);

export const CardTitle = ({ className, ...props }: CardProps) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props} />
);

export const CardContent: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props} />
);
