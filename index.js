#!/usr/bin/env node
import files from "./fileContent";
(function () {
	const fs = require("fs");
	const path = require("path");

	fs.mkdir(
		path.join("src", "components"),
		{recursive: true},
		(err) => {
			if (err) {
				return console.error(err);
			}
		}
	);

	// ************************************************************

	[
		"src/App.test.js",
		"src/setupTests.js",
		"src/reportWebVitals.js",
		"src/logo.svg",
		"public/manifest.json",
		"public/favicon.ico",
		"public/logo192.png",
		"public/logo512.png"
	]
	.forEach(file => {
		if (fs.existsSync(file)){
			fs.rm(file, {recursive: true}, (err) => {
				if (err) {
					throw err;
				}
				console.log("Removed: ", file);
			});
		}
	});
	
	// ************************************************************
	
	files.forEach(file => {
		try {
			fs.writeFileSync(file.src, file.content);
			console.log("Rewrote ", file.src);
		} catch (err) {
			console.error(err);
		}
	});
})();