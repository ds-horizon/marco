// @ts-check
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import { defineConfig } from 'astro/config';

import d2 from 'astro-d2';

const SITE = 'https://marco.dreamsportslabs.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [starlight({
    title: 'Marco',
    pagination: true,
    titleDelimiter: '/',
    description: 'Track and optimize your app’s performance with ease.',
    logo: {
      dark: './src/assets/logo-dark.svg',
      light: './src/assets/logo-light.svg',
      alt: 'Marco Logo',
      replacesTitle: true,
    },
    social: {
      github: 'https://github.com/ds-horizon/marco',
      discord: 'https://discord.gg/xYP8EZ9U',
    },
    sidebar: [
      {
        label: 'Project',
        autogenerate: { directory: 'project' },
      },
      {
        label: 'API reference',
        items: [
          'api/static-configuration',
          'api/tracking-screen',
          'api/methods',
          'api/native-event',
          {
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
        label: 'Guides',
        autogenerate: { directory: 'guides' },
      },
      {
        label: 'Architecture',
        items: ['architecture/draw-time-tracking'],
      },
    ],
    customCss: ['./src/tailwind.css', '@fontsource-variable/inter'],
    components: {
      Head: './src/overrides/head.astro',
    },
  }), tailwind({ applyBaseStyles: false }), react(), d2()],
});
