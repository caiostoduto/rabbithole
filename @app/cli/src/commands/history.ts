import { Command } from "commander";
import settings from '../utils/settings.js'
import chalk from 'chalk'

export async function addCommandHistory(program: Command) {
  program.command('history')
    .description('Show history')
    .action(action);
}

async function action(path: string): Promise<void> {
  const url = new URL(settings.get('rabbithole_url'))
  const history = (settings.get('history') ?? {}) as Record<string, string>

  if (Object.keys(history).length === 0) return console.log(chalk.red('No history'))

  console.log('History:')

  Object.keys(history).forEach((fileid) => {
    console.log(`${chalk.yellow(history[fileid])} | ${chalk.green(url + fileid)}`)
  })
}
