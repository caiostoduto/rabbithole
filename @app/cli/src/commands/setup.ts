import { Command } from "commander";
import inquirer from 'inquirer';
import settings from '../utils/settings.js'

export async function addCommandSetup(program: Command) {
  program.command('setup')
    .description('Setup rabbithole cli settings')
    .action(action);
}

async function action(path: string, options: options): Promise<void> {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'rabbithole_url',
        message: "Rabbithole URL",
        validate(value) {
          try {
            if (!value.startsWith('https://')) {
              return invalid()
            } else {
              new URL(value)
              return true
            }
          } catch (e) {
            return invalid()
          }

          function invalid() {
            return 'Please enter a valid https URL'
          }
        },
      },
    ])
    .then((answers) => {
      settings.overwrite(answers)
      console.log('\nSettings saved')
    })
}

interface options {
  url: string
}
