import React from 'react';
import Link from '@docusaurus/Link';

interface ShowcaseItem {
  title: string;
  url: string;
  description: string;
  features: string[];
}

const showcaseItems: ShowcaseItem[] = [
  {
    title: 'React Native Benchmark',
    url: 'https://reactnativebenchmark.dev/',
    description:
      'A comprehensive benchmarking tool for React Native applications that helps developers compare performance across different architectures and configurations.',
    features: [
      'Performance comparison across RN architectures',
      'Real-world benchmarks for common UI patterns',
      'Interactive dashboard for analyzing results',
    ],
  },
  {
    title: 'React Navigation Benchmark',
    url: 'https://ds-horizon.github.io/react-navigation-benchmark/',
    description:
      'A specialized benchmarking tool focused on measuring and optimizing React Navigation performance in React Native applications.',
    features: [
      'Navigation-specific performance metrics',
      'Screen transition timing analysis',
      'Stack, Tab, and Drawer navigator benchmarks',
    ],
  },
  {
    title: 'React Native Tabs Benchmark',
    url: 'https://ds-horizon.github.io/rn-tabs-benchmarks/',
    description:
      'Performance benchmarking for different tab implementations in React Native, helping developers choose the best tab solution for their apps.',
    features: [
      'Comprehensive comparison of tab libraries',
      'Performance metrics for tab switching',
      'Data-driven recommendations',
    ],
  },
  {
    title: 'Gorhom Bottom Sheet Benchmark',
    url: 'https://ds-horizon.github.io/GorhomBottomSheetBenchmark/',
    description:
      'Benchmarking tool for evaluating the performance of @gorhom/bottom-sheet, a popular React Native bottom sheet component.',
    features: [
      'Bottom sheet animation performance metrics',
      'Gesture handling and interaction timing',
      'Optimization recommendations',
    ],
  },
];

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  return (
    <div className="showcase-card">
      <div className="showcase-card-header">
        <h3 className="showcase-card-title">{item.title}</h3>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="showcase-link"
        >
          Visit Site →
        </a>
      </div>
      <p className="showcase-card-description">{item.description}</p>
      <div className="showcase-preview">
        <div className="browser-chrome">
          <div className="browser-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="browser-url">{item.url}</div>
        </div>
        <iframe
          src={item.url}
          className="showcase-iframe"
          title={item.title}
          loading="lazy"
        />
      </div>
      <ul className="showcase-features">
        {item.features.map((feature, idx) => (
          <li key={idx}>✓ {feature}</li>
        ))}
      </ul>
    </div>
  );
}

export default function BuiltWithMarco(): JSX.Element {
  return (
    <section className="built-with-marco-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="gradient-text">Built with Marco</span>
          </h2>
          <p className="section-subtitle">
            Real-world applications using Marco for performance tracking and
            optimization
          </p>
        </div>

        <div className="showcase-grid">
          {showcaseItems.map((item, idx) => (
            <ShowcaseCard key={idx} item={item} />
          ))}
        </div>

        <div className="showcase-cta">
          <p>Building something awesome with Marco?</p>
          <div className="cta-buttons">
            <Link
              className="button-secondary"
              to="https://github.com/ds-horizon/marco"
            >
              Share on GitHub
            </Link>
            <Link className="button-secondary" to="https://discord.gg/xYP8EZ9U">
              Join Discord
            </Link>
            <Link className="button-primary" to="/showcase/built-with-marco">
              View All Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

