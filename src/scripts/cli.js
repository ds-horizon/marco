#!/usr/bin/env node

const { Command } = require('commander');
const generateReport = require('./generate-report');
const serveDashboard = require('./serve-dashboard');
const { cosmiconfig } = require('cosmiconfig');

const program = new Command();

(async () => {
  const configLoader = cosmiconfig('marco');
  const configFile = await configLoader.search();
  const config = configFile ? configFile.config : {};

  // Extract config with defaults
  const androidConfig = config.android || {};
  const iosConfig = config.ios || {};
  const defaultOutputPath = 'marco-reports';
  const defaultDataDir = 'marco-reports/log.json';

  program
    .name('marco')
    .description('CLI tool for performance tracking and visualization')
    .version('1.0.0');

  // Define the `generate` subcommand
  program
    .command('generate')
    .description('Generate performance reports')
    .option('--platform <platform>', 'Specify platform: android or ios')
    .option('--packageName <package>', 'Specify the package name (required)')
    .option('-o, --outputPath <path>', 'Specify the output path for reports')
    .action((options) => {
      const { platform, outputPath, packageName } = options;

      if (!platform) {
        console.error(
          'Error: Platform is required. Use --platform or -p <platform>.'
        );
        process.exit(1);
      }

      if (!['android', 'ios'].includes(platform)) {
        console.error(
          'Error: Invalid platform. Valid values are "android" or "ios".'
        );
        process.exit(1);
      }

      // Determine final package name (from CLI or config file)
      const finalPackageName =
        packageName ||
        (platform === 'android'
          ? androidConfig.packageName
          : iosConfig.packageName);

      if (!finalPackageName) {
        console.error(
          'Error: Package name is required. Use --packageName or specify it in marco.config.js.'
        );
        process.exit(1);
      }

      // Determine final output path
      const finalOutputPath =
        outputPath ||
        (platform === 'android'
          ? androidConfig.outputPath
          : iosConfig.outputPath) ||
        defaultOutputPath;

      generateReport(platform, finalPackageName, finalOutputPath);
    });

  // Define the `visualize` subcommand
  program
    .command('visualize')
    .description('Serve the performance report dashboard')
    .option('-p, --port <port>', 'Specify the port', '8080')
    .option('-d, --dataDir <dataDir...>', 'Specify the data directory path')
    .option('--platform <platform>', 'Specify platform: android or ios')
    .action((options) => {
      const { platform, port } = options;
      let dataDirs = options.dataDir || []; // Use CLI input first

      // If a single string is provided, convert it to an array
      if (typeof dataDirs === 'string') {
        dataDirs = [dataDirs];
      }

      // Use platform-specific config if valid platform is provided
      if (platform && !['android', 'ios'].includes(platform)) {
        console.error('Error: Invalid platform. Use "android" or "ios".');
        process.exit(1);
      }

      if (dataDirs.length === 0 && platform) {
        let defaultPlatformDataDir =
          platform === 'android' ? androidConfig?.dataDir : iosConfig?.dataDir;

        if (defaultPlatformDataDir) {
          // Ensure it's always an array and flatten it
          defaultPlatformDataDir = Array.isArray(defaultPlatformDataDir)
            ? defaultPlatformDataDir
            : [defaultPlatformDataDir];

          dataDirs.push(...defaultPlatformDataDir);
        }
      }

      if (dataDirs.length === 0) {
        dataDirs.push(defaultDataDir);
      }

      // Use provided port or default
      serveDashboard(port || '8080', dataDirs);
    });

  // Parse arguments
  program.parse(process.argv);
})();
