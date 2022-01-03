"use strict";
const co = require("co");
const chalk = require("chalk");
const inquirer = require("inquirer");
const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
const download = require('../lib/download')
const generator = require("../lib/generator");

module.exports = () => {
  co(function* () {
    yield inquirer
      .prompt([
        {
          type: "list",
          message: "Choose your template",
          name: "tplName",
          choices: ["vue3", "vue3-ts", "react", "react-ts"],
          default: "react-ts",
        },
        {
          type: "input",
          message: "请输入项目名称",
          name: "projectName",
          default: "default_project",
        },
        {
          type: "list",
          message: "file is exist, cover?",
          name: "fileExist",
          choices: ["cover", "exit"],
          default: "react-ts",
          when: async (answer) => {
            try {
              let stat = await fs.promises.lstat(answer.projectName);
              return stat.isDirectory();
            } catch (err) {
              return false;
            }
          },
        },
      ])
      .then((answer = { projectName: "", fileExist: "", tplName: "" }) => {
        const dir = path.join(process.cwd(), answer.projectName);
        if (answer.fileExist && answer.fileExist === "cover") {
          rimraf.sync(dir, {});
        } else if (answer.fileExist && answer.fileExist === "exit") {
          process.exit();
        }
        if (answer.tplName === "react-ts") {
          download(answer.projectName).then(target => {
            return generator({
              name: answer.projectName,
              root: answer.projectName,
              tmp: target,
              // tmp: path.join("template/react-ts"),
              metadata: {
                ...answer,
              },
            });
          });
        }
      });
  }).catch((err) => {
    console.log(chalk.red(err));
  });
};
