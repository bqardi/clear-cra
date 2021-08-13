const files = [
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
		content: `import "./App.css";

		function App() {
			return (
				<div className="App">
					Clear
				</div>
			);
		}
		
		export default App;
		`
	},
	{
		src: "src/App.css",
		content: `.App {
			color: hsl(0, 0%, 8%);
		}
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

export default files;