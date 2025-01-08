// @ts-check
import starlight from "@astrojs/starlight";

import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercelStatic from "@astrojs/vercel";

import { defineConfig } from "astro/config";

const SITE = "https://github.com/dream-sports-labs/";

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: "Marco",
      // head: meta(SITE),
      pagination: true,
      titleDelimiter: "/",
      description:
        "Simple, composable, and effective state management for JavaScript.",
      logo: {
        dark: "./src/assets/logo-dark.png",
        light: "./src/assets/logo-light.png",
        alt: "Marco Logo",
        replacesTitle: true,
      },
      social: {
        github: "https://github.com/dream-sports-labs/react-native-performance-tracker",
      },
      sidebar: [
        {
          label: "Project",
          autogenerate: { directory: "project" },
        },
        {
          label: "Guides",
          autogenerate: {
            directory: "guides",
          },
        },
        {
          label: "API",
          autogenerate: { directory: "api" },
        },
        {
          label: "CLI",
          autogenerate: { directory: "cli" },
        },
      ],
      customCss: ["./src/tailwind.css", "@fontsource-variable/inter"],
      components: {
        Head: "./src/overrides/head.astro",
      },
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
});
