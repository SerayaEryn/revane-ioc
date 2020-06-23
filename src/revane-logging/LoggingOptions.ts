export class LoggingOptions {
  constructor (
    public rootLevel: string,
    public levels: object,
    public basePackage: string,
    public file?: string,
    public path?: string) {}
}
