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
      ? '/sdcard/Documents/PerformanceTracker/log.txt'
      : `xcrun simctl get_app_container booted ${iosPackage} data`;

  getReport(adbFilePath);
  convertTxtToJson(`${outputPath}/log.txt`, `${outputPath}/log.json`);

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
          `cp ${result.trim()}/Documents/PerformanceTracker/log.txt ${outputPath}`,
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

  function convertTxtToJson(txtFilePath, jsonFilePath) {
    try {
      console.log(`[INFO] Converting ${txtFilePath} to JSON...`);
      const data = fs.readFileSync(txtFilePath, 'utf8');

      const jsonArray = data
        .trim()
        .split('\n')
        .map((line) => {
          const [tagName, timestamp] = line.split(',');
          return {
            tagName,
            timestamp: Number(timestamp),
          };
        });

      fs.writeFileSync(
        jsonFilePath,
        JSON.stringify(jsonArray, null, 2),
        'utf8'
      );
      fs.unlinkSync(txtFilePath);
      console.log(`[SUCCESS] Converted JSON saved at ${jsonFilePath}`);
    } catch (error) {
      console.error(`[ERROR] Error converting .txt to JSON:`, error.message);
    }
  }
};
