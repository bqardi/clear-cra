const { ensureDir, resolveRootPath } = require("./utils");
const fs = require("fs");
const chalk = require('chalk');

class Folder {
  constructor({ folderPath } = {}) {
    if (folderPath === undefined)
      throw new Error("folderPath must be provided.");
    this.folderPath = folderPath;
    this.isAdded = !fs.existsSync(this.folderPath);
  }

  add() {
    try {
      ensureDir(resolveRootPath(this.folderPath));
      console.log(chalk.yellow("Created:"), chalk.green(this.folderPath));
      this.isAdded = true
    } catch {
      console.log(
        chalk.red(`Unable to add folder:`),
        chalk.green(this.folderPath)
      );
    }
  }
}

module.exports = Folder;
