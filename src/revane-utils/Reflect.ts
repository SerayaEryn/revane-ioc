class ReflectImpl {
  private readonly metadata: Map<any, Map<string | Symbol, any>> = new Map()

  defineMetadata (
    key: string | Symbol,
    value: any,
    target: Object
  ): void {
    if (this.metadata.get(target) == null) {
      this.metadata.set(target, new Map())
    }
    this.metadata.get(target).set(key, value)
  }

  getMetadata (key: any, target: Object): any {
    const metaDataForKey = this.metadata.get(target)
    if (key == null || metaDataForKey == null) {
      return null
    }
    return metaDataForKey.get(key)
  }
}

const Reflect = new ReflectImpl()
export { Reflect }
