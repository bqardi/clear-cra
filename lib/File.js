const { ensureDir, resolveRootPath } = require("./utils");
const fs = require("fs");
const chalk = require("chalk");

class File {
  constructor({ filePath } = {}) {
    if (filePath === undefined) throw new Error("filePath must be provided.");
    this.filePath = filePath;
    this.isRemoved = !fs.existsSync(this.filePath);
    this.restorePath = `./node_modules/clear-cra/.fileStore/${this.filePath}`;
  }

  remove() {
    // Move file to .fileStore, prepare for restore function.
    if (!this.isRemoved) {
      try {
        ensureDir(resolveRootPath("./node_modules/clear-cra/.fileStore", this.filePath));
        fs.renameSync(
          resolveRootPath(this.filePath),
          resolveRootPath(this.restorePath)
        );
        this.isRemoved = true;
        console.log(chalk.magenta("Removed:"), chalk.green(this.filePath));
      } catch (err){
        console.log( err )
        console.log(
          chalk.red(`Unable to remove file:`),
          chalk.green(this.filePath)
        );
      }
    }
  }

  restore() {
    // Restore file from .fileStore.
    if (this.isRemoved && this.restorePath) {
      try {
        fs.renameSync(
          resolveRootPath(this.restorePath),
          resolveRootPath(this.filePath)
        );
        this.isRemoved = false;
        console.log(chalk.green("Restored:"), chalk.green(this.filePath));
      } catch {
        console.log(
          chalk.red(`Unable to restore file:`),
          chalk.green(this.filePath)
        );
      }
    }
  }
}

module.exports = File;
