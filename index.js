#!/usr/bin/env node

const chalk = require("chalk");
const inquirer = require("inquirer");

(function () {
	const fs = require("fs");
	const path = require("path");

	if (!fs.existsSync("package.json")){
		console.log(
			chalk.red("Error!"),
			chalk.gray("You need to run"),
			chalk.cyan("npx create-react-app [project-name]"),
			chalk.gray("BEFORE you run"),
			chalk.cyan("npx clear-cra") + chalk.gray("!"));
		return;
	}

	inquirer.prompt([
		{
			name: "options",
			type: "checkbox",
			message: "Select options",
			choices: [
				"Keep tests",
				"Keep src/manifest.json",
				"Keep src/App.css",
				"Add src/components folder",
				"Add src/hooks folder",
				"Add src/contexts folder"
			],
		},
		{
			name: "contexts",
			type: "list",
			message: "You selected 'contexts' -folder, would you like to create a global provider?",
			choices: [
				"No thanks!",
				"Create",
				"Create w/example + comments",
			],
			when: (answers) => answers.databasetype === "Add src/contexts folder"
		},
	])
	.then((answers) => {
		var files = [
			"src/App.css",
			"src/App.test.js",
			"src/setupTests.js",
			"src/reportWebVitals.js",
			"src/logo.svg",
			"public/manifest.json",
			"public/logo192.png",
			"public/logo512.png"
		];
		var srcFolders = [];
		answers.options.forEach(option => {
			if (option === "Keep tests") {
				files = files.filter(file => file !== "src/App.test.js" && file !== "src/setupTests.js");
			}
			if (option === "Keep src/manifest.json") {
				files = files.filter(file => file !== "public/manifest.json" && file !== "public/logo192.png" && file !== "public/logo512.png");
			}
			if (option === "Keep src/App.css") {
				files = files.filter(file => file !== "public/App.css");
			}
			if (option === "Add src/components folder") {
				srcFolders.push("components");
			}
			if (option === "Add src/hooks folder") {
				srcFolders.push("hooks");
			}
			if (option === "Add src/contexts folder") {
				srcFolders.push("contexts");
				console.log(answers.contexts);
			}
		});


		
		files.forEach(file => {
			if (fs.existsSync(file)){
				fs.rm(file, {recursive: true}, (err) => {
					if (err) throw err;
					console.log(chalk.magenta("Removed:"), chalk.green(file));
				});
			}
		});

		srcFolders.forEach(folder => {
			fs.mkdir(
				path.join("src", folder),
				{recursive: true},
				err => {
					if (err) return console.error(chalk.red(err));
					console.log(chalk.yellow("Created:"), chalk.green(folder));
				}
			);
		});

const srcIndexJS = `import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
`;
const srcIndexCSS = `body {
	margin: 0;
}
`;
const srcAppJS = `${answers.options.includes("Keep src/App.css") ? "import \"App.css\";\n\n" : ""}function App() {
	return (
		${answers.options.includes("Keep tests") ? "Learn React" : "null"}
	);
}

export default App;
`;
const srcAppCSS = `.App {
	color: red;
}
`;
const publicIndexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#000000" />
	<meta
		name="description"
		content="Web site created using create-react-app"
	/>${answers.options.includes("Keep src/manifest.json") ? "\n\t<link rel=\"apple-touch-icon\" href=\"%PUBLIC_URL%/logo192.png\" />" : ""}
	${answers.options.includes("Keep src/manifest.json") ? "<link rel=\"manifest\" href=\"%PUBLIC_URL%/manifest.json\" />\n" : ""}<title>React App</title>
</head>
<body>
	<noscript>You need to enable JavaScript to run this app.</noscript>
	<div id="root"></div>
</body>
</html>
`;

		var changeFiles = [
			{
				src: "src/index.js",
				content: srcIndexJS
			},
			{
				src: "src/index.css",
				content: srcIndexCSS
			},
			{
				src: "src/App.js",
				content: srcAppJS
			},
			{
				src: "public/index.html",
				content: publicIndexHTML
			}
		]

		if (answers.options.includes("Keep src/App.css")) {
			changeFiles.push({
				src: "src/App.css",
				content: srcAppCSS
			});
		}

		changeFiles.forEach(file => {
			try {
				fs.writeFileSync(file.src, file.content);
				console.log(chalk.yellow("Rewrote:"), chalk.green(file.src));
			} catch (err) {
				console.log(chalk.red(err));
			}
		});
	});
})();