import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { Card, CardGrid } from '@site/src/components/Card';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <header className="hero-section">
      <div className="hero-background">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
      </div>

      <div className="hero-content">
        <h1 className={`hero-title ${visible ? 'slide-up' : ''}`}>
          <span className="gradient-text">Marco</span>
        </h1>

        <p className={`hero-subtitle ${visible ? 'slide-up delay-1' : ''}`}>
          Measure . Analyze . Optimize
        </p>

        <p className={`hero-description ${visible ? 'slide-up delay-2' : ''}`}>
          Track render times, draw times, and custom performance markers across
          iOS and Android. Visualize bottlenecks with an interactive dashboard.
        </p>

        <div className={`hero-buttons ${visible ? 'slide-up delay-3' : ''}`}>
          <Link className="button-primary" to="/project/quick-start">
            <span>Get Started</span>
            <span className="button-arrow">→</span>
          </Link>
          <Link
            className="button-secondary"
            to="https://github.com/ds-horizon/marco"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              fill="currentColor"
              style={{ marginRight: '0.5rem' }}
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>View on GitHub</span>
          </Link>
        </div>

        <div className={`hero-stats ${visible ? 'fade-in delay-4' : ''}`}>
          <div className="stat-item">
            <div className="stat-value">⚡ Fast</div>
            <div className="stat-label">Minimal Overhead</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-value">📊 Visual</div>
            <div className="stat-label">Interactive Dashboard</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-value">🎯 Precise</div>
            <div className="stat-label">Native Tracking</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to track and optimize performance
          </p>
        </div>

        <CardGrid>
          <Card title="🎯 Precise Tracking" icon="">
            Measure exact render and draw times for screens and components.
            Track the moment content becomes visible to users.
          </Card>

          <Card title="⚡ Lightning Fast" icon="">
            Minimal overhead ensures tracking doesn't impact app performance.
            Optimized for production environments.
          </Card>

          <Card title="📱 Cross-Platform" icon="">
            Seamless support for React-Native, iOS and Android with native
            implementations. Consistent API across both platforms.
          </Card>

          <Card title="🔧 Custom Markers" icon="">
            Place custom performance markers anywhere in your app. Track
            business-critical events and user interactions.
          </Card>

          <Card title="📊 Visual Dashboard" icon="">
            Interactive dashboard to visualize performance data. Compare metrics
            across multiple test runs.
          </Card>

          <Card title="🚀 Easy Integration" icon="">
            Get started in minutes with simple setup. Works with new and old
            React Native architecture.
          </Card>
        </CardGrid>
      </div>
    </section>
  );
}

function CodeShowcase() {
  const codeRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, []);

  return (
    <section className="code-showcase-section">
      <div className="container">
        <div className="showcase-content">
          <div className="showcase-text">
            <h2 className="showcase-title">Simple & Intuitive API</h2>
            <p className="showcase-description">
              Wrap your components with{' '}
              <code>&lt;PerformanceTracker /&gt;</code> and start measuring. No
              complex setup required.
            </p>
            <ul className="showcase-features">
              <li>✓ Track render and draw times automatically</li>
              <li>✓ Add custom performance markers</li>
              <li>✓ Export and visualize data</li>
              <li>✓ Works with any React Native app</li>
            </ul>
          </div>
          <div className="showcase-code">
            <div className="code-header">
              <div className="code-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="code-title">App.tsx</div>
            </div>
            <pre>
              <code
                ref={codeRef}
                className="language-typescript"
              >{`import { PerformanceTracker } from '@d11/marco';

// Configure once
PerformanceTracker.configure({
  persistToFile: true
});

// Wrap your screen
const MyScreen = () => (
  <PerformanceTracker tagName="HomeScreen">
    {/* Your content */}
  </PerformanceTracker>
);

// Add custom markers
PerformanceTracker.track(
  'API_Call_Complete',
  Date.now()
);`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="showcase-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="gradient-text">Built with Marco</span>
          </h2>
          <p className="section-subtitle">
            See how developers are using Marco to benchmark and optimize their
            apps
          </p>
        </div>

        <div className="showcase-projects">
          {/* Project 1: RN Tabs Benchmarks */}
          <div className="showcase-content-wrapper">
            <div className="showcase-info">
              <div className="showcase-icon">📊</div>
              <h3 className="showcase-project-title">
                React Native Tabs Benchmarks
              </h3>
              <p className="showcase-project-description">
                Comprehensive performance comparison of popular React Native tab
                navigation libraries, powered by Marco's precise tracking.
              </p>
              <div className="showcase-tags">
                <span className="showcase-tag">Benchmarking</span>
                <span className="showcase-tag">Tab Navigation</span>
                <span className="showcase-tag">Performance</span>
              </div>
              <a
                href="https://ds-horizon.github.io/rn-tabs-benchmarks/"
                target="_blank"
                rel="noopener noreferrer"
                className="showcase-external-link"
              >
                Open in New Tab →
              </a>
            </div>

            <div className="showcase-iframe-container">
              <div className="iframe-window">
                <div className="iframe-header">
                  <div className="iframe-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <div className="iframe-title">
                    ds-horizon.github.io/rn-tabs-benchmarks
                  </div>
                  <a
                    href="https://ds-horizon.github.io/rn-tabs-benchmarks/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="iframe-expand"
                    title="Open in new tab"
                  >
                    ↗
                  </a>
                </div>
                <div className="iframe-content">
                  <iframe
                    src="https://ds-horizon.github.io/rn-tabs-benchmarks/"
                    title="React Native Tabs Benchmarks"
                    className="showcase-iframe"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project 2: React Native Benchmark */}
          <div className="showcase-content-wrapper">
            <div className="showcase-info">
              <div className="showcase-icon">⚡</div>
              <h3 className="showcase-project-title">React Native Benchmark</h3>
              <p className="showcase-project-description">
                Community-driven benchmarking platform for React Native
                libraries and components, utilizing Marco for accurate
                performance measurements.
              </p>
              <div className="showcase-tags">
                <span className="showcase-tag">Community</span>
                <span className="showcase-tag">Libraries</span>
                <span className="showcase-tag">Benchmarks</span>
              </div>
              <a
                href="https://reactnativebenchmark.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="showcase-external-link"
              >
                Open in New Tab →
              </a>
            </div>

            <div className="showcase-iframe-container">
              <div className="iframe-window">
                <div className="iframe-header">
                  <div className="iframe-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                  </div>
                  <div className="iframe-title">reactnativebenchmark.dev</div>
                  <a
                    href="https://reactnativebenchmark.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="iframe-expand"
                    title="Open in new tab"
                  >
                    ↗
                  </a>
                </div>
                <div className="iframe-content">
                  <iframe
                    src="https://reactnativebenchmark.dev"
                    title="React Native Benchmark"
                    className="showcase-iframe"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolInAction() {
  return (
    <section className="tool-action-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="gradient-text">See Marco in Action</span>
          </h2>
        </div>

        <div className="action-content">
          <div className="action-demo">
            <div className="demo-window">
              <div className="demo-header">
                <div className="demo-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="demo-title">Marco Dashboard</div>
              </div>
              <div className="demo-content">
                <img
                  src="/img/dashboard.gif"
                  alt="Marco Dashboard in Action"
                  className="demo-gif"
                />
              </div>
            </div>
          </div>

          <div className="action-steps">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Track Performance</h3>
                <p className="step-description">
                  Wrap your React Native screens with{' '}
                  <code>&lt;PerformanceTracker /&gt;</code> to automatically
                  measure render and draw times.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Generate Reports</h3>
                <p className="step-description">
                  Use the CLI to fetch performance data from your device and
                  generate detailed JSON reports.
                </p>
                <div className="step-code">
                  <code>yarn marco generate --platform android</code>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Visualize & Optimize</h3>
                <p className="step-description">
                  Launch the interactive dashboard to visualize timelines,
                  compare iterations, and identify performance bottlenecks.
                </p>
                <div className="step-code">
                  <code>yarn marco visualize --platform android</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Performance Benchmarking for React Native`}
      description="Measure, analyze, and optimize your React Native app's performance. Track render times, draw times, and custom markers across iOS and Android."
    >
      <div className="homepage-wrapper">
        <HomepageHeader />
        <main>
          <ToolInAction />
          <HomepageFeatures />
          <CodeShowcase />
          <Showcase />
        </main>
      </div>
    </Layout>
  );
}
