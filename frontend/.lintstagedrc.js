module.exports = {
  '*.{ts,html}': (files) => [
    `pnpm ng lint ${relativeFilePaths(files, '--lint-file-patterns=')} --fix`,
    `pnpm prettier ${relativeFilePaths(files)} --write `,
  ],
  '*.{json,scss,css,yaml}': (files) =>
    `pnpm prettier ${relativeFilePaths(files)} --write `,
};

function relativeFilePaths(files, prefix = '') {
  return files.map((file) => `${prefix}"${file}"`).join(' ');
}
