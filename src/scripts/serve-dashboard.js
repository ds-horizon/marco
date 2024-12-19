#!/usr/bin/env node
const { exec } = require('child_process');
const path = require('path');
const fs = require("fs");

// Define constants for paths and ports
const appRoot = process.env.INIT_CWD || process.cwd();
const outputPath = path.resolve(appRoot, 'generated-perf-reports/');
const bundlePath = 'node_modules/dream11-react-native-performance-tracker/dist';
const folderPath = path.resolve(process.cwd(), bundlePath);
const HTML_PORT = '8082';
const DATA_PORT = '8083';

// Function to execute a command with inherited stdio
const runCommandWithOutput = (command) => {
  console.log(`[INFO] Executing command: ${command}`);
  return exec(command, { stdio: 'inherit' });
};

// Check if the performance data folder exists
if (!fs.existsSync(outputPath)) {
  console.error(`[ERROR] Performance data not found at: ${outputPath}`);
  console.error(`[INFO] Please run the data fetch script first.`);
  process.exit(1);
}

// Logs for paths and server ports
console.log(`[INFO] HTML files will be served from: ${folderPath}`);
console.log(`[INFO] Performance data will be served from: ${outputPath}`);
console.log(`[INFO] HTML Server Port: ${HTML_PORT}`);
console.log(`[INFO] Data Server Port: ${DATA_PORT}`);

// Define commands to run the servers
const buildWebCommand = `cd ${folderPath} && npx http-server -p ${HTML_PORT}`;
const dataServerCommand = `npx http-server ${outputPath} -p ${DATA_PORT} --cors`;

try {
  console.log(`[INFO] Starting servers...`);

  // Start the HTML server
  console.log(`[INFO] Starting HTML server...`);
  const htmlServer = runCommandWithOutput(buildWebCommand);

  // Start the Data server
  console.log(`[INFO] Starting Data server...`);
  const dataServer = runCommandWithOutput(dataServerCommand);

  // Log messages when servers are successfully started
  htmlServer.on('spawn', () => {
    console.log(`[SUCCESS] HTML server is running at http://localhost:${HTML_PORT}`);
  });

  dataServer.on('spawn', () => {
    console.log(`[SUCCESS] Data server is running at http://localhost:${DATA_PORT}`);
  });

} catch (error) {
  console.error(`[ERROR] Failed to start servers.`);
  console.error(`[ERROR] ${error.message}`);
  console.error(`[STACK TRACE] ${error.stack}`);
}