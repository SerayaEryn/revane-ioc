export interface Configuration {
  has: (key: string) => boolean
  get: (key: string) => any
  getString: (key: string) => string
  getNumber: (key: string) => number
  getBoolean: (key: string) => boolean
}
