#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const stdio = {
  stdio: 'inherit',
};
const appRoot = process.env.INIT_CWD || process.cwd();
// Define the ADB command and target paths
const adbFilePath = '/sdcard/Documents/PerformanceTracker/log.txt'; // Source file on the Android device
const outputPath = path.resolve(appRoot, 'generated-perf-report/'); // Destination in the app's root

getReportForAndroid(adbFilePath);
convertTxtToJson(`${outputPath}/log.txt`, `${outputPath}/log.json`);

function getReportForAndroid(filePath) {
  try {
    execSync(`adb shell ls ${filePath}`, stdio);
    console.log(`${filePath} found.`);

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }
    console.log(`Output path: ${outputPath}`);
    execSync(`adb pull ${filePath} ${outputPath}`, stdio);
  } catch (_error) {
    console.log(_error);
  }
}

function convertTxtToJson(txtFilePath, jsonFilePath) {
  try {
    // Read the .txt file content
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

    // Save to a JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2), 'utf8');

    // Delete txt file
    fs.unlinkSync(txtFilePath);
    console.log(`Converted JSON saved at ${jsonFilePath}`);
  } catch (error) {
    console.error('Error converting .txt to JSON:', error);
  }
}
