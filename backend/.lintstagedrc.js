module.exports = {
  '*.cs': (files) => [
    `dotnet jb cleanupcode ${relativeFilePaths(files)}`,
    `dotnet format --include ${relativeFilePaths(files)}`,
  ],
  '*.{json,scss,css,yaml}': (files) =>
    `pnpm prettier ${relativeFilePaths(files)} --write `,
};

function relativeFilePaths(files, prefix = '') {
  return files.map((file) => `${prefix}"${file}"`).join(' ');
}
