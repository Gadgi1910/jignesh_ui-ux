const fs = require('node:fs');
const path = require('node:path');
const { projects } = require('../js/content.js');
const root = path.resolve(__dirname, '..');
for (const project of projects) {
  const source = fs.readFileSync(path.join(root, project.image), 'utf8');
  const mobile = ['fitness-live', 'riderly', 'bloodconnect'].includes(project.id);
  const detail = mobile ? (project.id === 'bloodconnect' ? '580 100 520 710' : '180 100 450 710') : '230 190 700 570';
  const system = mobile ? '0 70 1200 730' : '100 180 1000 560';
  for (const [name, view] of [['detail', detail], ['system', system]]) {
    const artwork = source.replace('viewBox="0 0 1200 900"', `viewBox="${view}" preserveAspectRatio="xMidYMid slice"`)
      .replace('width="1200" height="900"', name === 'detail' ? 'width="900" height="1100"' : 'width="1400" height="800"');
    fs.writeFileSync(path.join(root, `assets/images/${project.id}-${name}.svg`), artwork);
  }
}
console.log('Built project detail and visual-system gallery assets.');
