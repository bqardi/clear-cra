#!/usr/bin/env node

const chalk = require('chalk');

(function () {
	const fs = require("fs");
	const path = require("path");

	fs.mkdir(
		path.join("src", "components"),
		{recursive: true},
		err => {
			if (err) return console.error(chalk.red(err));
		}
	);

	[
		"src/App.test.js",
		"src/App.css",
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
				if (err) throw err;
				console.log(chalk.magenta("Removed:"), chalk.green(file));
			});
		}
	});

	[
		{
			src: "src/index.js",
			content: `import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
`
		},
		{
			src: "src/index.css",
			content: `body {
	margin: 0;
}
`
		},
		{
			src: "src/App.js",
			content: `function App() {
	return (
		null
	);
}

export default App;
`
		},
		{
			src: "public/index.html",
			content: `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#000000" />
	<meta
		name="description"
		content="Web site created using create-react-app"
	/>
	<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
	<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
	<title>React App</title>
</head>
<body>
	<noscript>You need to enable JavaScript to run this app.</noscript>
	<div id="root"></div>
</body>
</html>
`
		}
	]
	.forEach(file => {
		try {
			fs.writeFileSync(file.src, file.content);
			console.log(chalk.yellow("Rewrote:"), chalk.green(file.src));
		} catch (err) {
			console.log(chalk.red(err));
		}
	});
})();