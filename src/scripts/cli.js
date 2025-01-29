#!/usr/bin/env node

const { Command } = require('commander');
const generateReport = require('./generate-report');
const serveDashboard = require('./serve-dashboard');
const { cosmiconfig } = require('cosmiconfig');

const program = new Command();

// Load configuration using cosmicconfig
(async () => {
  const configLoader = cosmiconfig('marco'); // Namespace for configuration
  const configFile = await configLoader.search(); // Search for configuration
  const configFileOptions = configFile ? configFile.config : {};
  program
    .name('marco')
    .description('CLI tool for performance tracking and visualization')
    .version('1.0.0');

  // Define the `generate` subcommand
  program
    .command('generate')
    .description('Generate performance reports')
    .option(
      '-p, --platform <platform>',
      'Specify platform: android or ios',
      configFileOptions.platform
    )
    .option(
      '--ios-package <package>',
      'Specify the iOS package name (required for iOS platform)',
      configFileOptions.iosPackage
    )
    .option(
      '-o, --outputPath <path>',
      'Specify the output path for reports',
      configFileOptions.outputPath || './generated-perf-reports' // Default value
    )
    .action((options) => {
      // Validate platform
      if (!options.platform) {
        console.error(
          'Error: Platform is required. Use --platform or -p <platform>.'
        );
        process.exit(1);
      }

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
      generateReport(options.platform, options.iosPackage, options.outputPath);
    });

  // Define the `visualize` subcommand
  program
    .command('visualize')
    .description('Serve the performance report dashboard')
    .option(
      '-p, --port <port>',
      'Specify the port',
      configFileOptions.port || '8080'
    )
    .option(
      '-d, --dataDir <dataDir>',
      'Specify the directory path from which to visualize the data',
      configFileOptions.dataDir || './generated-perf-reports/log.json' // Default value
    )
    .action((options) => {
      serveDashboard(options.port, options.dataDir);
    });

  // Parse arguments
  program.parse(process.argv);
})();
