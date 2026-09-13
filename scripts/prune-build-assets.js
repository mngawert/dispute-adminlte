const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const buildDir = path.join(projectRoot, 'build');
const keepPluginDirs = new Set(['bootstrap', 'fontawesome-free', 'jquery']);
const keepDistCssFiles = new Set(['adminlte.min.css', 'style.css']);
const keepDistJsFiles = new Set(['adminlte.min.js']);
const slimMode = process.argv.includes('--slim');

function exists(targetPath) {
  return fs.existsSync(targetPath);
}

function removeIfExists(targetPath) {
  if (exists(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

function pruneMaps(dirPath) {
  if (!exists(dirPath)) {
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      pruneMaps(fullPath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.map')) {
      fs.rmSync(fullPath, { force: true });
    }
  }
}

function prunePlugins() {
  const pluginsDir = path.join(buildDir, 'plugins');
  if (!exists(pluginsDir)) {
    return;
  }

  const entries = fs.readdirSync(pluginsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (!keepPluginDirs.has(entry.name)) {
      removeIfExists(path.join(pluginsDir, entry.name));
    }
  }
}

function pruneDist() {
  const distDir = path.join(buildDir, 'dist');
  const distCssDir = path.join(distDir, 'css');
  const distCssAltDir = path.join(distCssDir, 'alt');
  const distJsDir = path.join(distDir, 'js');

  removeIfExists(distCssAltDir);

  if (exists(distCssDir)) {
    for (const entry of fs.readdirSync(distCssDir, { withFileTypes: true })) {
      if (!entry.isFile()) {
        continue;
      }
      if (!keepDistCssFiles.has(entry.name)) {
        fs.rmSync(path.join(distCssDir, entry.name), { force: true });
      }
    }
  }

  if (exists(distJsDir)) {
    for (const entry of fs.readdirSync(distJsDir, { withFileTypes: true })) {
      if (!entry.isFile()) {
        continue;
      }
      if (!keepDistJsFiles.has(entry.name)) {
        fs.rmSync(path.join(distJsDir, entry.name), { force: true });
      }
    }
  }
}

function run() {
  if (!exists(buildDir)) {
    console.warn('Build directory does not exist. Run the build command first.');
    process.exit(0);
  }

  pruneMaps(buildDir);
  prunePlugins();
  pruneDist();

  if (slimMode) {
    removeIfExists(path.join(buildDir, 'files'));
  }

  console.log(`Prune complete${slimMode ? ' (slim mode)' : ''}.`);
}

run();
