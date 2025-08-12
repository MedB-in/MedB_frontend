const fs = require('fs');
const { version } = require('../package.json');

fs.writeFileSync('./public/version.json', JSON.stringify({
    version,
    timestamp: Date.now()
}), 'utf8');

console.log(`Version file created: ${version}`);