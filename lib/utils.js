const fs = require("fs");
const path = require("path");

function ensureDir(dirPath) {
	fs.mkdirSync(path.dirname(dirPath), { recursive: true });
}

function resolveRootPath(...relativePath) {
	return path.resolve(process.cwd(), ...relativePath);
}

module.exports = {
	ensureDir,
	resolveRootPath,
};
