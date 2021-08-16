const fs = require("fs");
const config = require("./clearcra.defaultConfig");
const { resolveRootPath } = require("./utils");

/**
 *
 * @description User could write `clearcra.config.json` to override our config.
 * @example
 * clearcra.config.json
 * {
 *    removeFiles: ['src/App.css', 'public/robots.txt'],
 *    addFolders: ['src/hooks']
 * }
 */
function mergeConfigFromUser() {
  try {
    let userConfig = fs.readFileSync(resolveRootPath("clearcra.config.json"));
    userConfig = JSON.parse(userConfig);
    return userConfig;
  } catch {}
}

module.exports = {
  ...config,
  ...mergeConfigFromUser(),
};
