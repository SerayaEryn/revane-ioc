export function replaceAll (
  string: string,
  searchString: string,
  replacement: string
): string {
  let result = string
  let index = 0
  while (index !== -1) {
    result = result.replace(searchString, replacement)
    index = result.indexOf(searchString)
  }
  return result
}
