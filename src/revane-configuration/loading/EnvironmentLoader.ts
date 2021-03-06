import { replaceAll } from '../StringReplaceAll'

export function replaceEnvironmentVariables (content: string): string {
  let result = content
  for (const name of Object.keys(process.env)) {
    result = replaceAll(result, `$\{${name}}`, process.env[name])
  }
  return result
}
