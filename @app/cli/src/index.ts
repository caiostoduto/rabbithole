#! /usr/bin/env node

import { Command } from "commander";
import { readFileSync } from "fs";
import { addCommandSetup } from "./commands/setup.js";
import { addCommandUpload } from "./commands/upload.js";

const program = new Command()
  .version(JSON.parse(readFileSync("./package.json", "utf-8")).version)
  .description("Rabbithole CLI");

addCommandUpload(program);
addCommandSetup(program)

program.parse();
