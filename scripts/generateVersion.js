// scripts/generateVersion.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '../package.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const versionData = {
  version: pkg.version,
  timestamp: new Date().toISOString()
};

fs.writeFileSync(
  path.join(__dirname, '../public/version.json'),
  JSON.stringify(versionData, null, 2),
  'utf8'
);

console.log(`Version file created: ${versionData.version} at ${versionData.timestamp}`);