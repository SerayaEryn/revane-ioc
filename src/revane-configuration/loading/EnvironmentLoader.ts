export function replaceEnvironmentVariables (content: string): string {
  let result = content
  for (const name of Object.keys(process.env)) {
    const envValue = process.env[name]
    if (envValue != null) {
      result = result.replaceAll(`$\{${name}}`, envValue)
    }
  }
  return result
}
