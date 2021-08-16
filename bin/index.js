#!/usr/bin/env node

const chalk = require("chalk");
const inquirer = require("inquirer");
const file = require("../lib/fileContent");
const File = require("../lib/File");
const Folder = require("../lib/Folder");
const clearcraConfig = require("../lib/clearcra.config");

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
        ],
        when: (answers) => answers.action === actions.ADD_FOLDERS,
      },
      {
        name: "context",
        type: "list",
        message:
          "You selected 'contexts' -folder, would you like to create a global provider?",
        choices: ["No thanks!", "Create", "Create w/comments"],
        when: (answers) =>
          answers.folders?.find((f) => f.folderPath.includes("src/contexts")),
      },
    ])
    .then((answers) => {
      // Remove files
      if (answers.action === actions.CLEAR_FILES) {
        // Give a nice log if there is nothing to remove
        if (filesToRemove.every((file) => file.isRemoved)) {
          return console.log(chalk.gray("✨ Already cleared"));
        }
        filesToRemove.forEach((file) => {
          file.remove();
        });
      }

      // Restore files (Not support restore `add folders` yet~)
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

      function createWriteFile(src, content, message = "Rewrote:") {
        try {
          fs.writeFileSync(src, content);
          console.log(chalk.yellow(message), chalk.green(src));
        } catch (err) {
          console.log(chalk.red(err));
        }
      }
    });
})();
