export function pathWithEnding (path: string, ending: string) {
    if (['http', 'path', 'fs', 'crypto'].includes(path)) {
        return path
    }
    if (path.startsWith('node:')) {
        return path
    }
    if (path.endsWith(ending)) {
        return path
    }
    return path + ending
}