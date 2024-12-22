#!/usr/bin/env node

const { Command } = require('commander');
const generateReport = require('./generate-report');
const serveDashboard = require('./serve-dashboard');
const { cosmiconfig } = require('cosmiconfig');

const program = new Command();

// Define global options with defaults
let globalOptions = {
  outputPath: './generated-perf-reports', // Default value
  cliOutputPathSet: false,
};

// Load configuration using cosmicconfig
(async () => {
  const configLoader = cosmiconfig('perf-tracker'); // Namespace for configuration
  const searchedFor = await configLoader.search(); // Search for configuration
  const configFileOptions = searchedFor ? searchedFor.config : {};
  console.log('Configuration loaded from file:', configFileOptions);
  program
    .name('perf-tracker')
    .description('CLI tool for performance tracking and visualization')
    .version('1.0.0')
    .option(
      '-o, --outputPath <path>',
      'Specify the output path for reports (shared between generate and visualize)',
      (value) => {
        console.log('global options', value);
        globalOptions.outputPath = value; // Store the path globally
        globalOptions.cliOutputPathSet = true;
        return value;
      },
      './generated-perf-reports' // Default or config file
    );

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
    .action((options) => {
      // Merge CLI options with config file
      const mergedOptions = {
        ...configFileOptions,
        ...options,
        outputPath: globalOptions.cliOutputPathSet
          ? globalOptions.outputPath // CLI-provided value takes precedence
          : configFileOptions.outputPath || globalOptions.outputPath, // Ensure outputPath is from CLI or merged
      };

      console.log('Merged Options ', mergedOptions);

      // Validate platform
      if (!mergedOptions.platform) {
        console.error(
          'Error: Platform is required. Use --platform or -p <platform>.'
        );
        process.exit(1);
      }

      if (!['android', 'ios'].includes(mergedOptions.platform)) {
        console.error(
          'Error: Invalid platform. Valid values are "android" or "ios".'
        );
        process.exit(1);
      }

      if (mergedOptions.platform === 'ios' && !mergedOptions.iosPackage) {
        console.error(
          'Error: iOS package name is required. Use --ios-package <package>.'
        );
        process.exit(1);
      }

      generateReport(
        mergedOptions.platform,
        mergedOptions.iosPackage,
        mergedOptions.outputPath
      );
    });

  // Define the `visualize` subcommand
  program
    .command('visualize')
    .description('Serve the performance report dashboard')
    .option(
      '-p, --port <port>',
      'Specify the port (default: 8080)',
      configFileOptions.port || '8080'
    )
    .action((options) => {
      const mergedOptions = {
        ...configFileOptions,
        ...options,
        outputPath: globalOptions.cliOutputPathSet
          ? globalOptions.outputPath // CLI-provided value takes precedence
          : configFileOptions.outputPath || globalOptions.outputPath,
      };
      console.log('Merged Options', mergedOptions);
      console.log(`Serving dashboard on port ${options.port}`);
      serveDashboard(options.port, mergedOptions.outputPath);
    });

  // Parse arguments
  program.parse(process.argv);
})();
