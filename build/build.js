const path = require('path');
const fs = require('fs').promises;

let buildFolder = path.join(__dirname, 'build');

async function clearFolder(dir = '') {
  const files = await fs.readdir(dir);

  for (let file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.lstat(filePath);
    if (stat.isDirectory()) await fs.rmdir(filePath);
    if (stat.isFile()) await fs.unlink(filePath);
  }
}
async function hasFile(file = '') {
  let result = 'NONE';
  await fs.stat(file)
    .then((stats) => {
      if (stats.isFile()) result = 'FILE';
      else result = 'DIR';
    })
    .catch((err) => {
      if (err) result = 'NONE';
    });
  return result;
}
async function makeDir(dir = '', replace = false) {
  const has = await hasFile(dir);
  if (has == 'NONE') fs.mkdir(dir);
  else if (has == 'FILE') {
    if (replace) {
      await fs.unlink(dir);
      await fs.mkdir(dir);
    }
  }
}



(async () => {
  const buildHas = await hasFile(buildFolder);
  if (buildHas == 'DIR') {
    console.log(` Clearing build folder`);
    await clearFolder(buildFolder);
  } else {
    console.log(` Making build folder`);
    await makeDir(buildFolder, true);
  }


})();