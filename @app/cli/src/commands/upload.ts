import axios from 'axios';
import { Command } from "commander";
import Listr from 'listr';
import { lookup } from 'mime-types';
import { existsSync, readFileSync } from "node:fs";
import { basename } from 'node:path';
import { preSignedData } from '../types/upload.js';


export async function addCommandUpload(program: Command) {
  program.command('upload')
    .description('Split a string into substrings and display as an array')
    .argument('<path>', 'string to split')
    .option('-u, --url <url>', 'rh base url')
    .aliases(['u', 'up'])
    .action(action);
}

async function action(path: string, options: options): Promise<void> {
  if (!await existsSync(path)) {
    return console.log(`error: file ${path} does not exist`)
  }

  const baseURL = new URL(options.url)
  const name = basename(path)
  const contentType = lookup(path)

  await new Listr([
    {
      title: 'Request pre-signed URL',
      task: async (ctx) => {
        ctx.data = (await axios.post(baseURL + 'uploads', {
          name,
          contentType
        })).data as preSignedData
      }
    },
    {
      title: 'Upload file',
      task: async (ctx) => {
        const file = await readFileSync(path)

        await axios.put(ctx.data.signedUrl, file, {
          headers: {
            'Content-Type': contentType
          }
        })

        ctx.success = true
      }
    }
  ]).run()
    .catch(() => { })
    .then((ctx) => {
      if (ctx.success === true) console.log(`\n${baseURL + ctx.data.fileId}`)
    })
}

interface options {
  url: string
}
