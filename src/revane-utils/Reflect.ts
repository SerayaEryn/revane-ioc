class ReflectImpl {
  private readonly metadata: Map<any, Map<string | Symbol, any>> = new Map()

  defineMetadata (
    key: string | Symbol,
    value: any,
    target: Object
  ): void {
    let metadataForTarget = this.metadata.get(target)
    if (metadataForTarget == null) {
      metadataForTarget = new Map()
    }
    metadataForTarget.set(key, value)
    this.metadata.set(target, metadataForTarget)
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
