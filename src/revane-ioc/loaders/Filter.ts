export default interface Filter {
  applies: (entry: string) => boolean
}
