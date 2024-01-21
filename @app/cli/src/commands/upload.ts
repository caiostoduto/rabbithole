import got from "got";
import { Command } from "commander";
import Listr from 'listr';
import { lookup } from 'mime-types';
import { existsSync, createReadStream, statSync } from "node:fs";
import { basename } from 'node:path';
import { PreSignedData } from '../types/upload.js';
import { Observable } from 'rxjs';
import { progressBar } from '../utils/progress.js';
import settings from "../utils/settings.js";


export async function addCommandUpload(program: Command) {
  program.command('upload')
    .description('Upload file to rabbithole storage')
    .argument('<path>', 'path to file')
    .option('-u, --url <url>', 'rabbithole url')
    .aliases(['u', 'up'])
    .action(action);
}

async function action(path: string, options: options): Promise<void> {
  if (!existsSync(path)) {
    return console.log(`error: file ${path} does not exist`)
  }

  let baseURL: URL
  try {
    baseURL = new URL(options.url ?? settings.get('rabbithole_url'))
  } catch (e) {
    return console.log('error: invalid rabbithole url\ntry running `rabbithole setup`')
  }
  const name = basename(path)
  const contentType = lookup(path)

  await new Listr([
    {
      title: 'Request pre-signed URL',
      task: async (ctx) => {
        ctx.data = JSON.parse((await got.post(baseURL + 'uploads', {
          json: {
            name,
            contentType
          }
        })).body) as PreSignedData
      }
    },
    {
      title: 'Upload file',
      task: async (ctx) => {
        return await new Observable((observer) => {
          const file = createReadStream(path, { highWaterMark: 1024 * 1024 })
          const start = new Date()

          got.put(ctx.data.signedUrl, {
            body: file,
            headers: {
              'Content-Type': contentType as string,
              'Content-Length': statSync(path).size.toString()
            },
          }).on('uploadProgress', (progress) => {
            observer.next(progressBar(progress, start))
          }).then(() => {
            ctx.success = true
            observer.complete()
          })
        })
      }
    }
  ]).run()
    .catch(() => { })
    .then((ctx) => {
      if (ctx && ctx.success === true) console.log(`\n${baseURL + ctx.data.fileId}`)
    })
}

interface options {
  url: string
}
