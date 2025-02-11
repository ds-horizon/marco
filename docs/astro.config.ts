// @ts-check
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import { defineConfig } from 'astro/config';

const SITE = 'https://marco.dreamsportslabs.com';
const googleAnalyticsId = process.env.GOOGLE_ANALYTICS_TOKEN;

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [
    starlight({
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
        github: 'https://github.com/dream-sports-labs/marco',
        discord: 'https://discord.gg/RBDPaN2V',
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
      ],
      customCss: ['./src/tailwind.css', '@fontsource-variable/inter'],
      components: {
        Head: './src/overrides/head.astro',
      },
      head: [
        {
          tag: 'script',
          attrs: {
            src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
          },
        },
        {
          tag: 'script',
          content: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${googleAnalyticsId}');
          `,
        },
      ],
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
});
