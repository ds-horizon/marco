#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = function serveDashboard(port, outputPathDir) {
  const appRoot = process.env.INIT_CWD || process.cwd();

  const logFilePath = path.resolve(appRoot, outputPathDir);

  const marcoPath = 'node_modules/dream11-marco';
  const webFolderPath = path.resolve(process.cwd(), `${marcoPath}/web/dist`);
  const assetsFolder = path.join(webFolderPath, 'assets');

  // Ensure the `assets` folder exists
  if (!fs.existsSync(assetsFolder)) {
    fs.mkdirSync(assetsFolder, { recursive: true });
  }

  // Copy `log.json` to `web/dist/assets`
  const destinationPath = path.join(assetsFolder, 'log.json');
  if (fs.existsSync(logFilePath)) {
    fs.copyFileSync(logFilePath, destinationPath);
  } else {
    console.error(`Error: log.json not found at ${logFilePath}`);
    return;
  }

  const serveCommand = `npx serve -s "${webFolderPath}" -p ${port}`;

  console.log(`Server runnign at: http://localhost:${port}`);

  const serveProcess = exec(serveCommand);

  serveProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  serveProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Serve process exited with code ${code}`);
    }
  });
};
