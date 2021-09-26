export class LoggingOptions {
  constructor (
    public rootLevel: string,
    public levels: { [key: string]: string },
    public basePackage: string,
    public file: string | null,
    public path: string | null,
    public format: 'JSON' | 'SIMPLE'
  ) {}
}
