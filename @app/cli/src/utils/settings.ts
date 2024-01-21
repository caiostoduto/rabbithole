import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from 'url';
import { Settings } from "../types/settings.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const path = join(__dirname, '../../settings.json')


function get(key: keyof Settings): any {
  try {
    const obj = JSON.parse(readFileSync(path, 'utf-8')) as Settings
    return obj[key]
  } catch (e) {
    return undefined
  }
}

function set(key: keyof Settings, value: any): Settings {
  const obj = JSON.parse(readFileSync(path, 'utf-8'))
  obj[key] = value

  writeFileSync(path, JSON.stringify(obj, null, 2))

  return obj as Settings
}

function overwrite(obj: Settings) {
  writeFileSync(path, JSON.stringify(obj, null, 2))
}

export default {
  get,
  set,
  overwrite
}