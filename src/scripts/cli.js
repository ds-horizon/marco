#!/usr/bin/env node

const { Command } = require('commander');
const generateReport = require('./generate-report');
const serveDashboard = require('./serve-dashboard');

const program = new Command();

// Define global options
let globalOptions = {
  outputPath: './generated-perf-reports', // Default value
};

program
  .name('perf-tracker')
  .description('CLI tool for performance tracking and visualization')
  .version('1.0.0')
  .option(
    '-o, --outputPath <path>',
    'Specify the output path for reports (shared between generate and visualize)',
    (value) => {
      globalOptions.outputPath = value; // Store the path globally
      return value;
    },
    './generated-perf-reports' // Default path
  );

// Define the `generate` subcommand
program
  .command('generate')
  .description('Generate performance reports')
  .option('-p, --platform <platform>', 'Specify platform: android or ios')
  .option(
    '--ios-package <package>',
    'Specify the iOS package name (required for iOS platform)'
  )
  .action((options) => {
    // Check if the platform is provided
    if (!options.platform) {
      console.error(
        'Error: Platform is required. Use --platform or -p <platform>.'
      );
      process.exit(1);
    }

    // Validate the platform value (must be 'android' or 'ios')
    if (!['android', 'ios'].includes(options.platform)) {
      console.error(
        'Error: Invalid platform. Valid values are "android" or "ios".'
      );
      process.exit(1);
    }

    if (options.platform === 'ios' && !options.iosPackage) {
      console.error(
        'Error: iOS package name is required. Use --ios-package <package>.'
      );
      process.exit(1);
    }

    console.log(`Generating report for platform: ${options.platform}`);
    console.log(`Output path: ${globalOptions.outputPath}`);

    generateReport(
      options.platform,
      options.iosPackage,
      globalOptions.outputPath
    );
  });

// Define the `visualize` subcommand
program
  .command('visualize')
  .description('Serve the performance report dashboard')
  .option('-p, --port <port>', 'Specify the port (default: 8080)', '8080')
  .action((options) => {
    serveDashboard(options.port, globalOptions.outputPath);
  });

// Parse arguments
program.parse(process.argv);
