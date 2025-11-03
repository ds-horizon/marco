import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Project',
      items: ['project/introduction', 'project/quick-start'],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/static-configuration',
        'api/tracking-screen',
        'api/methods',
        'api/native-event',
        {
          type: 'category',
          label: 'CLI',
          items: [
            'api/cli/overview',
            'api/cli/generate-report',
            'api/cli/visualization',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/app-startup',
        'guides/screen-load',
        'guides/multiple-events',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: ['architecture/draw-time-tracking'],
    },
    {
      type: 'category',
      label: 'Showcase',
      items: ['showcase/built-with-marco'],
    },
  ],
};

export default sidebars;
