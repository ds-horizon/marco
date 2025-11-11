import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Marco',
  tagline: "Track and optimize your app's performance with ease.",
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://marco.dreamsportslabs.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'ds-horizon',
  projectName: 'marco',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/ds-horizon/marco/tree/main/docs/docs/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-P61N0RKY4H',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },

  themeConfig: {
    // Replace with your project's social card
    image: 'img/banner.png',
    metadata: [
      {
        name: 'keywords',
        content:
          'javascript, typescript, performance, rendering, tracker, measuring, react, time, benchmark, view',
      },
      { name: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Marco Logo',
        src: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/ds-horizon/marco',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://discord.gg/xYP8EZ9U',
          label: 'Discord',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/project/introduction',
            },
            {
              label: 'Quick Start',
              to: '/project/quick-start',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/xYP8EZ9U',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/ds-horizon/marco',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'API Reference',
              to: '/api/tracking-screen',
            },
            {
              label: 'Guides',
              to: '/guides/app-startup',
            },
            {
              label: 'Showcase',
              to: '/showcase/built-with-marco',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Dream Sports Labs. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: [
        'bash',
        'kotlin',
        'swift',
        'objectivec',
        'java',
        'json',
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
