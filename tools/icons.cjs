const fs = require('node:fs');
const path = require('node:path');
module.exports = function icon(name) {
  return fs.readFileSync(path.join(__dirname, '../assets/icons/tabler', name + '.svg'), 'utf8')
    .replace('<svg', '<svg aria-hidden="true" focusable="false"')
    .replace('class="icon ', 'class="tabler-icon icon ');
};
