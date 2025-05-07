#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = function serveDashboard(port, outputPathDirs) {
  const appRoot = process.env.INIT_CWD || process.cwd();
  const marcoPath = 'node_modules/@d11/marco';
  const webFolderPath = path.resolve(process.cwd(), `${marcoPath}/web/dist`);
  const assetsFolder = path.join(webFolderPath, 'assets');
  const manifestPath = path.join(assetsFolder, 'manifest.json');

  // Ensure the `assets` folder exists
  if (!fs.existsSync(assetsFolder)) {
    fs.mkdirSync(assetsFolder, { recursive: true });
  }

  const reports = [];
  const generatedAt = new Date().toISOString();

  outputPathDirs.forEach((outputPathDir, index) => {
    const logFilePath = path.resolve(appRoot, outputPathDir.path);

    // Copy `log.json` to `web/dist/assets`
    const destinationPath = path.join(assetsFolder, `log${index + 1}.json`);

    if (fs.existsSync(logFilePath)) {
      fs.copyFileSync(logFilePath, destinationPath);
    } else {
      console.error(`Error: File not found at ${logFilePath}`);
      return;
    }

    reports.push({
      path: `assets/log${index + 1}.json`,
      reportName: outputPathDir.reportName ?? `Report ${index + 1}`,
    });
  });

  // Create metadata
  const metadata = {
    totalReports: reports.length,
    generatedAt,
  };

  // Write structured manifest.json
  fs.writeFileSync(
    manifestPath,
    JSON.stringify({ reports, metadata }, null, 2)
  );

  const serveCommand = `npx serve -s "${webFolderPath}" -p ${port}`;

  console.log(`Server running at: http://localhost:${port}`);

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
