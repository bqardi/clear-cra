# Clear create-react-app

**After** you have created your React project with create-react-app, you can clean it up with:

`npx clear-cra`

This is a very simple package that tries to remove and change boilerplate files after you have run create-react-app.

This is very usefull when you don't want to remove all files yourself.

## Which files are removed?

These are the files that clear-cra tries to remove:

- src/App.css (choice to keep)
- src/App.test.js (choice to keep)
- src/setupTests.js (choice to keep)
- src/reportWebVitals.js
- src/logo.svg
- public/manifest.json (choice to keep)
- public/logo192.png (choice to keep)
- public/logo512.png (choice to keep)

## Which files are changed?

These are the files that clear-cra tries to change, with resulting code below each file:

- src/index.js

```javascript
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
```

- src/index.css

```css
body {
	margin: 0;
}
```

- src/App.js

```javascript
// import "./App.css"; - added if "Keep src/App.css" is chosen

function App() {
	return (
		null
	);
}

export default App;
```

- public/index.html

```html
<!DOCTYPE html>
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
	<!-- <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" /> - added if "keep src/manifest.json" is chosen -->
	<!-- <link rel="manifest" href="%PUBLIC_URL%/manifest.json" /> - added if "keep src/manifest.json" is chosen -->
	<title>React App</title>
</head>
<body>
	<noscript>You need to enable JavaScript to run this app.</noscript>
	<div id="root"></div>
</body>
</html>
```
