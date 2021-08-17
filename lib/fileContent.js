exports.content = {
  srcIndexJS: `import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
`,
  srcIndexCSS: `body {
	margin: 0;
}
`,
  srcAppJS: (keepTests, isGlobalContext, keepSrcAppCSS) => {
    return `${addImports(isGlobalContext, keepSrcAppCSS)}function App() {
	return (${isGlobalContext ? `\n\t\t<GlobalProvider value={{}}>` : ""}
${isGlobalContext ? "\t" : ""}${
      keepTests
        ? "\t\tLearn React"
        : isGlobalContext
        ? "\t\t{null}"
        : "\t\tnull"
    }
${isGlobalContext ? "\t\t</GlobalProvider>\n\t)" : "\t)"};
}

export default App;
`;
  },
  srcAppCSS: `.App {
	color: red;
}
`,
  publicIndexHTML: (keepManifest) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#000000" />
	<meta
		name="description"
		content="Web site created using create-react-app"
	/>${
    keepManifest
      ? '\n\t<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />'
      : ""
  }
	${
    keepManifest
      ? '<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />\n'
      : ""
  }<title>React App</title>
</head>
<body>
	<noscript>You need to enable JavaScript to run this app.</noscript>
	<div id="root"></div>
</body>
</html>
`;
  },
  contextCreate: `import { createContext, useContext } from "react";

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
`,
  contextCreateComment: `import { createContext, useContext } from "react";

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
`,
};

function addImports(isGlobalContext, keepSrcAppCSS) {
  var globalProvider = isGlobalContext
    ? `import { GlobalProvider } from "./contexts/GlobalContext";\n`
    : "";
  const appCSS = keepSrcAppCSS ? `import "App.css";\n\n` : "";

  if (globalProvider && !appCSS) {
    globalProvider += "\n";
  }

  return globalProvider + appCSS;
}
