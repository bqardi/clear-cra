#!/usr/bin/env node

const chalk = require("chalk");
const inquirer = require("inquirer");
const file = require("./fileContent");
const File = require("./File");
const Folder = require("./Folder");
const clearcraConfig = require('./clearcra.config');

/** Get files from config to be removed  */
const filesToRemove = clearcraConfig.removeFiles.map(
  (filePath) => new File({ filePath })
);
/** Get folder from config to be added  */
const foldersToAdd = clearcraConfig.addFolders.map(
  (folderPath) => new Folder({ folderPath })
);

(function () {
  const fs = require("fs");
  const path = require("path");

  if (!fs.existsSync("package.json")) {
    console.log(
      chalk.red("Error!"),
      chalk.gray("You need to run"),
      chalk.cyan("npx create-react-app [project-name]"),
      chalk.gray("BEFORE you run"),
      chalk.cyan("npx clear-cra") + chalk.gray("!")
    );
    return;
  }

  const actions = {
    CLEAR_FILES: "clear files",
    RESTORE_FILES: "restore files",
    ADD_FOLDERS: "add folders",
  };

  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message: "Select Actions",
        choices: [
          { name: "Clear files", value: actions.CLEAR_FILES },
          { name: "Restore files", value: actions.RESTORE_FILES },
          { name: "Add folders", value: actions.ADD_FOLDERS },
          // "Keep src/manifest.json",
          // "Keep src/App.css",
        ],
      },
      {
        name: "folders",
        type: "checkbox",
        message: "Select Folders to be added",
        choices: [
          ...foldersToAdd.map((folder) => ({
            name: `Add ${folder.folderPath} folder`,
            value: folder,
          })),
          // "Add src/components folder",
          // "Add src/hooks folder",
          // "Add src/contexts folder",
        ],
        when: (answers) => answers.action === actions.ADD_FOLDERS,
      },
      {
        name: "context",
        type: "list",
        message:
          "You selected 'contexts' -folder, would you like to create a global provider?",
        choices: ["No thanks!", "Create", "Create w/comments"],
        when: (answers) => answers.folders?.includes("src/contexts"),
      },
    ])
    .then((answers) => {
      // Remove files
      if (answers.action === actions.CLEAR_FILES) {
        filesToRemove.forEach((file) => {
          file.remove();
        });
      }

      // Restore files
      if (answers.action === actions.RESTORE_FILES) {
        filesToRemove.forEach((file) => {
          file.restore();
        });
      }

      // Add folders
      if (answers.action === actions.ADD_FOLDERS) {
        foldersToAdd.forEach((folder) => {
          folder.add();
        });
        // Handle context creation
        if (answers.context) {
          switch (answers.context) {
            case "Create":
              createWriteFile(
                path.join("src", "contexts", "GlobalContext.js"),
                file.content.contextCreate,
                "Created:"
              );
              break;
            case "Create w/comments":
              createWriteFile(
                path.join("src", "contexts", "GlobalContext.js"),
                file.content.contextCreateComment,
                "Created:"
              );
              break;

            default:
              break;
          }
        }
      }

      // var files = [
      //   "src/App.css",
      //   "src/App.test.js",
      //   "src/setupTests.js",
      //   "src/reportWebVitals.js",
      //   "src/logo.svg",
      //   "public/manifest.json",
      //   "public/logo192.png",
      //   "public/logo512.png",
      // ];

      // var srcFolders = [
      //   {
      //     dir: "src",
      //     name: "components",
      //     create: answers.options.includes("Add src/components folder"),
      //   },
      //   {
      //     dir: "src",
      //     name: "hooks",
      //     create: answers.options.includes("Add src/hooks folder"),
      //   },
      //   {
      //     dir: "src",
      //     name: "contexts",
      //     create: answers.options.includes("Add src/contexts folder"),
      //   },
      // ];

      // var changeFiles = [
      //   {
      //     src: "src/index.js",
      //     content: file.content.srcIndexJS,
      //   },
      //   {
      //     src: "src/index.css",
      //     content: file.content.srcIndexCSS,
      //   },
      //   {
      //     src: "src/App.js",
      //     content: file.content.srcAppJS(
      //       keep("Keep tests"),
      //       hasContext(),
      //       keep("Keep src/App.css")
      //     ),
      //   },
      //   {
      //     src: "public/index.html",
      //     content: file.content.publicIndexHTML(keep("Keep src/manifest.json")),
      //   },
      // ];

      // if (keep("Keep tests")) {
      //   console.log("keep tests");
      //   // files = files.filter(file => file !== "src/App.test.js" && file !== "src/setupTests.js");
      //   copyOriginalFile("src", "App.test.js");
      //   copyOriginalFile("src", "setupTests.js");
      // }
      // if (keep("Keep src/manifest.json")) {
      //   // files = files.filter(file => file !== "public/manifest.json" && file !== "public/logo192.png" && file !== "public/logo512.png");
      //   copyOriginalFile("public", "manifest.json");
      //   copyOriginalFile("public", "logo192.png");
      //   copyOriginalFile("public", "logo512.png");
      // }
      // if (keep("Keep src/App.css")) {
      //   // files = files.filter(file => file !== "public/App.css");
      //   copyOriginalFile("public", "App.css");
      //   changeFiles.push({
      //     src: "src/App.css",
      //     content: file.content.srcAppCSS,
      //   });
      // }

      // srcFolders.forEach((folder) => {
      //   if (folder.create) {
      //     fs.mkdir(
      //       path.join(folder.dir, folder.name),
      //       { recursive: true },
      //       (err) => {
      //         if (err) return console.error(chalk.red(err));
      //         console.log(chalk.yellow("Created:"), chalk.green(folder.name));
      //         if (folder.name === "contexts")
      //           createContextFile(answers.context);
      //       }
      //     );
      //   } else {
      //     fs.rm(
      //       path.join(folder.dir, folder.name),
      //       { recursive: true },
      //       (err) => {
      //         if (err) {
      //           if (err.code === "ENOENT") return;
      //           return console.error(chalk.red(err));
      //         }
      //         console.log(chalk.magenta("Removed:"), chalk.green(folder.name));
      //       }
      //     );
      //   }
      // });

      // files.forEach(removeFile);

      // changeFiles.forEach((file) => {
      //   createWriteFile(file.src, file.content);
      // });

      // function hasContext() {
      //   return (
      //     answers.context === "Create" ||
      //     answers.context === "Create w/comments"
      //   );
      // }

      // function keep(option) {
      //   return answers.options.includes(option);
      // }

      // function createContextFile(type) {
      //   switch (type) {
      //     case "No thanks!":
      //       removeFile(path.join("src", "contexts", "GlobalContext.js"));
      //       break;
      //     case "Create":
      //       createWriteFile(
      //         path.join("src", "contexts", "GlobalContext.js"),
      //         file.content.contextCreate,
      //         "Created:"
      //       );
      //       break;
      //     case "Create w/comments":
      //       createWriteFile(
      //         path.join("src", "contexts", "GlobalContext.js"),
      //         file.content.contextCreateComment,
      //         "Created:"
      //       );
      //       break;

      //     default:
      //       break;
      //   }
      // }

      // function copyOriginalFile(folder, file) {
      //   if (!fs.existsSync(file)) {
      //     fs.copyFile(
      //       path.join("node_modules/clear-cra/original", file),
      //       path.join(folder, file),
      //       (err) => {
      //         if (err) {
      //           console.log(
      //             chalk.red(
      //               "Restoring files is not implemented yet! Couldn't restore file:"
      //             ),
      //             chalk.green(file)
      //           );
      //           return;
      //         }
      //         console.log(chalk.yellow("Created:"), chalk.green(file));
      //       }
      //     );
      //   }
      // }

      function createWriteFile(src, content, message = "Rewrote:") {
        try {
          fs.writeFileSync(src, content);
          console.log(chalk.yellow(message), chalk.green(src));
        } catch (err) {
          console.log(chalk.red(err));
        }
      }

      // function removeFile(file) {
      //   if (fs.existsSync(file)) {
      //     fs.rm(file, { recursive: true }, (err) => {
      //       if (err) throw err;
      //       console.log(chalk.magenta("Removed:"), chalk.green(file));
      //     });
      //   }
      // }
    });
})();
