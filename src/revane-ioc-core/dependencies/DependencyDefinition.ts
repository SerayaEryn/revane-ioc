export class DependencyDefinition {
  constructor(
    public readonly type: string,
    public readonly value: any,
    public readonly classType: any | null,
  ) {}
}
