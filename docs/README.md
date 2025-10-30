# Marco Documentation (Docusaurus)

This is the documentation site for Marco, built with [Docusaurus](https://docusaurus.io/).

## Installation

```bash
yarn install
```

## Development

Start the development server:

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

Build the static site:

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Serve

Serve the production build locally:

```bash
yarn serve
```

## Project Structure

```
docs/
├── docs/                    # Documentation content (MDX files)
│   ├── project/            # Getting started
│   ├── api/                # API reference
│   ├── guides/             # Guides and tutorials
│   └── architecture/       # Architecture documentation
├── src/
│   ├── components/         # Custom React components
│   ├── css/               # Global styles
│   └── pages/             # Custom pages (homepage)
├── static/                # Static assets (images, etc.)
│   └── img/              # Images
├── docusaurus.config.ts   # Docusaurus configuration
├── sidebars.ts           # Sidebar configuration
└── package.json
```

## Features

- 📝 MDX support for rich content
- 🎨 Dark mode support
- 🔍 Full-text search (via Algolia - optional)
- 📱 Mobile responsive
- 🎯 Code syntax highlighting
- 📊 Mermaid diagram support
- 📈 Google Analytics integration
- 🔗 Auto-generated navigation
- ⚡ Fast static site generation

## Configuration

### Site Configuration

Edit `docusaurus.config.ts` to customize:

- Site metadata
- Navigation
- Footer
- Theme settings
- Analytics

### Sidebar

Edit `sidebars.ts` to customize the documentation sidebar structure.

### Styling

Edit `src/css/custom.css` to customize:

- Color theme
- Component styles
- Custom CSS

## Adding Documentation

1. Create a new MDX file in the appropriate `docs/` subdirectory
2. Add frontmatter with `title` and `sidebar_position`
3. Write your content using MDX
4. The page will automatically appear in the sidebar

Example:

```mdx
---
title: My New Page
sidebar_position: 1
---

# My New Page

Content goes here...
```

## Components

### Built-in Components

- **Tabs**: Tabbed content (e.g., for different package managers)
- **Admonitions**: Callouts (note, tip, warning, danger, info)
- **Code Blocks**: Syntax-highlighted code with language support

### Custom Components

- **Steps**: Numbered step-by-step instructions
- **Card/CardGrid**: Feature cards for homepage

## Links and Navigation

Use relative links for internal documentation:

```mdx
[Link to Quick Start](/project/quick-start)
[Link to API](/api/methods)
```

## Deployment

The site is configured to deploy to:

- **Production URL**: https://marco.dreamsportslabs.com
- **Repository**: https://github.com/ds-horizon/marco

For deployment instructions, see the Docusaurus [deployment documentation](https://docusaurus.io/docs/deployment).

## Troubleshooting

### Build Errors

If you encounter build errors, try:

```bash
yarn clear
yarn build
```

### Port Already in Use

If port 3000 is already in use:

```bash
yarn start --port 3001
```

## Resources

- [Docusaurus Documentation](https://docusaurus.io/)
- [MDX Documentation](https://mdxjs.com/)
- [Migration Guide](./MIGRATION.md)
