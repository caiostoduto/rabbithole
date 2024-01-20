#! /usr/bin/env node

import { Command } from "commander";
import { addCommandUpload } from "./commands/upload.js";

const program = new Command()
  .version("0.1.0")
  .description("Rabbithole CLI");

addCommandUpload(program);

program.parse();
