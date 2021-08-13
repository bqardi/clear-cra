#!/usr/bin/env node
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
	
	const srcAppTest = "src/App.test.js";
	if (fs.existsSync(srcAppTest)){
		fs.rm(srcAppTest, {recursive: true}, (err) => {
			if (err) {
				throw err;
			}
			console.log("Removed: ", srcAppTest);
		});
	}else{
		return;
	}
	
	const srcReportWebVitals = "src/reportWebVitals.js";
	if (fs.existsSync(srcReportWebVitals)){
		fs.rm(srcReportWebVitals, {recursive: true}, (err) => {
			if (err) {
				throw err;
			}
			console.log("Removed: ", srcReportWebVitals);
		});
	}else{
		return;
	}
	
	const srcLogo = "src/logo.svg";
	if (fs.existsSync(srcLogo)){
		fs.rm(srcLogo, {recursive: true}, (err) => {
			if (err) {
				throw err;
			}
			console.log("Removed: ", srcLogo);
		});
	}else{
		return;
	}
	
	const publicFavicon = "public/favicon.ico";
	if (fs.existsSync(publicFavicon)){
		fs.rm(publicFavicon, {recursive: true}, (err) => {
			if (err) {
				throw err;
			}
			console.log("Removed: ", publicFavicon);
		});
	}else{
		return;
	}
	
	const publicLogo192 = "public/logo192.png";
	if (fs.existsSync(publicLogo192)){
		fs.rm(publicLogo192, {recursive: true}, (err) => {
			if (err) {
					throw err;
			}
			console.log("Removed: ", publicLogo192);
		});
	}else{
		return;
	}
	
	const publicLogo512 = "public/logo512.png";
	if (fs.existsSync(publicLogo512)){
		fs.rm(publicLogo512, {recursive: true}, (err) => {
			if (err) {
					throw err;
			}
			console.log("Removed: ", publicLogo512);
		});
	}else{
		return;
	}
	
	// ************************************************************
	
	const indexContent = `import React from "react";
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
	try {
		const srcIndex = "src/index.js";
		fs.writeFileSync(srcIndex, indexContent);
		console.log("Rewrote ", srcIndex);
	} catch (err) {
		console.error(err);
	}
	
	const indexCSS = `body {
	margin: 0;
}
	`;
	try {
		const srcIndexCSS = "src/index.css";
		fs.writeFileSync(srcIndexCSS, indexCSS);
		console.log("Rewrote ", srcIndexCSS);
	} catch (err) {
		console.error(err);
	}
	
	const App = `import "./App.css";

function App() {
	return (
		<div className="App">
			Clear
		</div>
	);
}
export default App;
`;
	try {
		const srcApp = "src/App.js";
		fs.writeFileSync(srcApp, App);
		console.log("Rewrote ", srcApp);
	} catch (err) {
		console.error(err);
	}
	
	const appCSS = `.App {
	color: hsl(0, 0%, 8%);
}
	`;
	try {
		const srcAppCSS = "src/App.css";
		fs.writeFileSync(srcAppCSS, appCSS);
		console.log("Rewrote ", srcAppCSS);
	} catch (err) {
		console.error(err);
	}
	
	const htmlIndex = `<!DOCTYPE html>
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
`;

	try {
		const publicIndex = "public/index.html";
		fs.writeFileSync(publicIndex, htmlIndex);
		console.log("Rewrote ", publicIndex);
	} catch (err) {
		console.error(err);
	}
})();