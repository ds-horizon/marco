import { spawnSync } from 'child_process';
import { resolve } from 'path';

import { moveSync, readJSONSync, writeJSONSync } from 'fs-extra';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const { shouldPublish } = argv;

const MANIFEST_PATH = resolve(process.env.INIT_CWD || '', 'package.json');

const MANIFEST_BACKUP_PATH = resolve(
  process.env.INIT_CWD || '',
  'backup.package.json'
);

async function main() {
  spawnSync('yarn', ['bob', 'build'], {
    stdio: 'inherit',
  });

  spawnSync('yarn', ['build'], {
    stdio: 'inherit',
    cwd: resolve(process.env.INIT_CWD || '', 'web'),
  });

  const pkg = readJSONSync(MANIFEST_PATH);

  moveSync(MANIFEST_PATH, MANIFEST_BACKUP_PATH, {
    overwrite: true,
  });

  delete pkg.devDependencies;
  delete pkg['create-react-native-library'];
  delete pkg['react-native-builder-bob'];
  delete pkg.eslintIgnore;
  delete pkg.prettier;
  delete pkg.eslintConfig;
  delete pkg['release-it'];
  delete pkg.jest;
  delete pkg.commitlint;
  delete pkg.scripts;

  writeJSONSync(MANIFEST_PATH, pkg, { spaces: 2 });

  if (shouldPublish) {
    if (shouldPublish === 'yes') {
      console.log('Publishing (actually)');
      try {
        spawnSync('yarn', ['npm', 'publish'], {
          stdio: 'inherit',
        });
      } catch (e) {
        console.error('Publish failed', e);
      }
    } else {
      console.log('Publishing (not really)');
    }
  } else {
    console.log('Skipping publish');
  }

  moveSync(MANIFEST_BACKUP_PATH, MANIFEST_PATH, {
    overwrite: true,
  });
}

main();
