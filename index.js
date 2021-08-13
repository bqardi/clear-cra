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
			}
		});

		srcFolders.forEach(folder => {
			fs.mkdir(
				path.join("src", folder),
				{recursive: true},
				err => {
					if (err) return console.error(chalk.red(err));
					console.log(chalk.yellow("Created:"), chalk.green(folder));
					if (folder === "contexts") contextFile();
				}
			);
		});
		
		files.forEach(file => {
			if (fs.existsSync(file)){
				fs.rm(file, {recursive: true}, (err) => {
					if (err) throw err;
					console.log(chalk.magenta("Removed:"), chalk.green(file));
				});
			}
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
const srcAppJS = `${addImports()}function App() {
	return (${isGlobalContext() && `\n\t\t<GlobalProvider value={{}}>`}
		${isGlobalContext() && "\t"}${answers.options.includes("Keep tests") ? "Learn React" : isGlobalContext() ? "{null}" : "null"}
	${isGlobalContext() ? `</GlobalProvider>\n\t)` : ")"};
}

export default App;
`;

function addImports(){
	const appCSS = answers.options.includes("Keep src/App.css") ? `import "App.css";\n` : "";
	const globalProvider = isGlobalContext() ? `import { GlobalProvider } from "./contexts/GlobalContext";\n\n` : "";

	if (appCSS && !globalProvider) {
		appCSS += "\n";
	}

	return appCSS + globalProvider;
}

function isGlobalContext(){
	return answers.context === "Create" || answers.context === "Create w/comments";
}

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
			createWriteFile(file.src, file.content);
		});

		function createWriteFile(src, content, message="Rewrote:"){
			try {
				fs.writeFileSync(src, content);
				console.log(chalk.yellow(message), chalk.green(src));
			} catch (err) {
				console.log(chalk.red(err));
			}
		}

		function contextFile(){
			
			switch (answers.context) {
				case "Create":
					createWriteFile(path.join("src", "contexts", "GlobalContext.js"), `import { createContext, useContext } from "react";

var GlobalContext = createContext();

function useGlobalContext(){
	return useContext(GlobalContext);
}

export function GlobalProvider({children, value}){
	return (
		<GlobalContext.Provider value={value}>
			{children}
		</GlobalContext.Provider>
	);
}

export default useGlobalContext;
`, "Created:");
					break;
				case "Create w/comments":
					createWriteFile(path.join("src", "contexts", "GlobalContext.js"), `import { createContext, useContext } from "react";

// The actual context:
var GlobalContext = createContext();

// A custom hook that makes it a bit simpler to use:
// Usage:
// In whichever component you wish to get the value
// from the context, just import 'useGlobalContext'
// and destructure the value. For example:
// 
// import useGlobalContext from "useGlobalContext";
// 
// function Darkmode(){
//   // Destructuring 'darkmode' and 'setDarkmode' from the context:
//   var {darkmode, setDarkmode} = useGlobalContext();
// 
//   return (
//     // Toggling darkmode using 'setDarkmode' in the onClick event:
//     <button onClick={() => setDarkmode(prev => !prev)}>
//       // Using 'darkmode' from the context:
//       // Whenever we press the button, the 'darkmode' -value
//       // changes between dark and light, and the button rerenders
//       // meaning the button-text changes between "Go light" and "Go dark"
//       {darkmode ? "Go light" : "Go dark"}
//     </button>
//   )
// }
function useGlobalContext(){
	return useContext(GlobalContext);
}

// The Provider component:
export function GlobalProvider({children, value}){
	return (
		<GlobalContext.Provider value={value}>
			{children}
		</GlobalContext.Provider>
	);
}
// Usage (with the darkmode example from above):
// import { GlobalProvider } from "./contexts/GlobalContext";
// import Darkmode from "./components/Darkmode";
// 
// function App() {
//   // Setting a state:
//   var [darkmode, setDarkmode] = setState(false);
// 
// 	 return (
//     // Passing 'darkmode' and 'setDarkmode' to the provider:
// 		 <GlobalProvider value={{darkmode, setDarkmode}}>
//       // Now the Darkmode component has access to both
//       // 'darkmode' and 'setDarkmode' with the
//       // 'useGlobalContext' hook (see example above)
// 		   <Darkmode />
// 		 </GlobalProvider>
// 	 );
// }
// 
// export default App;

export default useGlobalContext;
`, "Created:");
					break;
			
				default:
					break;
			}
		}
		
	});
})();