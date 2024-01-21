#! /usr/bin/env node

import { Command } from "commander";
import { addCommandUpload } from "./commands/upload.js";
import { readFileSync } from "fs";

const program = new Command()
  .version(JSON.parse(readFileSync("./package.json", "utf-8")).version)
  .description("Rabbithole CLI");

addCommandUpload(program);

program.parse();
