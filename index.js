#!/usr/bin/env node

const chalk = require("chalk");
const inquirer = require("inquirer");
const file = require("./fileContent");

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
			name: "context",
			type: "list",
			message: "You selected 'contexts' -folder, would you like to create a global provider?",
			choices: [
				"No thanks!",
				"Create",
				"Create w/comments",
			],
			when: (answers) => answers.options.find(option => option === "Add src/contexts folder")
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
		var srcFolders = [
			{
				dir: "src",
				name: "components",
				create: answers.options.includes("Add src/components folder")
			},
			{
				dir: "src",
				name: "hooks",
				create: answers.options.includes("Add src/hooks folder")
			},
			{
				dir: "src",
				name: "contexts",
				create: answers.options.includes("Add src/contexts folder")
			}
		];

		var changeFiles = [
			{
				src: "src/index.js",
				content: file.content.srcIndexJS
			},
			{
				src: "src/index.css",
				content: file.content.srcIndexCSS
			},
			{
				src: "src/App.js",
				content: file.content.srcAppJS(keep("Keep tests"), hasContext(), keep("Keep src/App.css"))
			},
			{
				src: "public/index.html",
				content: file.content.publicIndexHTML(keep("Keep src/manifest.json"))
			}
		]

		if (keep("Keep src/App.css")) {
			changeFiles.push({
				src: "src/App.css",
				content: file.content.srcAppCSS
			});
		}
		
		if (answers.options.includes("Keep tests")) {
			files = files.filter(file => file !== "src/App.test.js" && file !== "src/setupTests.js");
		}
		if (answers.options.includes("Keep src/manifest.json")) {
			files = files.filter(file => file !== "public/manifest.json" && file !== "public/logo192.png" && file !== "public/logo512.png");
		}
		if (answers.options.includes("Keep src/App.css")) {
			files = files.filter(file => file !== "public/App.css");
		}

		srcFolders.forEach(folder => {
			if (folder.create) {
				fs.mkdir(
					path.join(folder.dir, folder.name),
					{recursive: true},
					err => {
						if (err) return console.error(chalk.red(err));
						console.log(chalk.yellow("Created:"), chalk.green(folder.name));
						if (folder.name === "contexts") createContextFile(answers.context);
					}
				);
			} else {
				fs.rm(
					path.join(folder.dir, folder.name),
					{recursive: true},
					err => {
						if (err) {
							if (err.code === "ENOENT") return;
							return console.error(chalk.red(err))
						};
						console.log(chalk.magenta("Removed:"), chalk.green(folder.name));
					}
				);
			}
		});
		
		files.forEach(removeFile);

		changeFiles.forEach(file => {
			createWriteFile(file.src, file.content);
		});

		function hasContext(){
			return answers.context === "Create" || answers.context === "Create w/comments";
		}
		
		function keep(option){
			return answers.options.includes(option);
		}

		function createContextFile(type){
			switch (type) {
				case "No thanks!":
					removeFile(path.join("src", "contexts", "GlobalContext.js"));
					break;
				case "Create":
					createWriteFile(path.join("src", "contexts", "GlobalContext.js"), file.content.contextCreate, "Created:");
					break;
				case "Create w/comments":
					createWriteFile(path.join("src", "contexts", "GlobalContext.js"), file.content.contextCreateComment, "Created:");
					break;
			
				default:
					break;
			}
		}

		function createWriteFile(src, content, message="Rewrote:"){
			try {
				fs.writeFileSync(src, content);
				console.log(chalk.yellow(message), chalk.green(src));
			} catch (err) {
				console.log(chalk.red(err));
			}
		}

		function removeFile(file){
			if (fs.existsSync(file)){
				fs.rm(file, {recursive: true}, (err) => {
					if (err) throw err;
					console.log(chalk.magenta("Removed:"), chalk.green(file));
				});
			}
		}
		
	});
})();