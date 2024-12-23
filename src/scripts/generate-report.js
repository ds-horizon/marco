#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = function generateReport(
  platform,
  iosPackage = null,
  outputPathDir
) {
  const appRoot = process.env.INIT_CWD || process.cwd();
  const outputPath = path.resolve(appRoot, outputPathDir);
  const adbFilePath =
    platform === 'android'
      ? '/sdcard/Documents/PerformanceTracker/log.json'
      : `xcrun simctl get_app_container booted ${iosPackage} data`;

  getReport(adbFilePath);

  function getReport(filePath) {
    try {
      let result;

      console.log(`[INFO] Checking file existence on ${platform}: ${filePath}`);
      if (platform === 'android') {
        execSync(`adb shell ls ${filePath}`, { stdio: 'inherit' });
      } else {
        result = execSync(filePath, { encoding: 'utf-8' });
      }

      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, {
          recursive: true,
        });
        console.log(`[INFO] Created output directory: ${outputPath}`);
      }

      console.log(`[INFO] Pulling file from ${platform} device...`);
      if (platform === 'android') {
        execSync(`adb pull ${filePath} ${outputPath}`, { stdio: 'inherit' });
      } else {
        execSync(
          `cp ${result.trim()}/Documents/PerformanceTracker/log.json ${outputPath}`,
          { stdio: 'inherit' }
        );
      }
      console.log(`[SUCCESS] File pulled successfully.`);
    } catch (error) {
      console.error(
        `[ERROR] Failed to fetch report for ${platform}:`,
        error.message
      );
      process.exit(1);
    }
  }
};
