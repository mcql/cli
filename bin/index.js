#!/usr/bin/env node

const program = require("commander");
const config = require("../package.json");

program.usage("<command>");

program
  .command("init")
  .description("init project")
  .alias("i")
  .action(() => {
    require("../lib/init")();
  });

program
  .version(config.version)
  .description("welcome to cli")
  .parse(process.argv);

if (!process.argv.length) {
  program.help();
}
