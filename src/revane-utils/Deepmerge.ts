export function deepMerge (target: object, source: object): object {
  const destination = {}
  if (isMergeable(target)) {
    for (const key of Object.keys(target)) {
      destination[key] = clone(target[key])
    }
  }
  for (const key of Object.keys(source)) {
    if (propertyIsUnsafe(target, key)) {
      continue
    }

    if (existsOn(target, key) && isMergeable(source[key])) {
      destination[key] = deepMerge(target[key], source[key])
    } else {
      destination[key] = clone(source[key])
    }
  }
  return destination
}

function clone (value): any {
  return isMergeable(value) ? deepMerge({}, value) : value
}

function existsOn (object, property: string): boolean {
  return object[property] !== undefined
}

function propertyIsUnsafe (target, key: string): boolean {
  return existsOn(target, key) &&
    !(ownProperty(target, key) && nonEnumerable(target, key))
}

function ownProperty (target: any, key: string): boolean {
  return Object.hasOwnProperty.call(target, key)
}

function nonEnumerable (target: any, key: string): boolean {
  return Object.propertyIsEnumerable.call(target, key)
}

function isMergeable (value): boolean {
  return isNotNull(value) && !isRegExpOrDate(value)
}

function isNotNull (value): boolean {
  return value != null && typeof value === 'object'
}

function isRegExpOrDate (value): boolean {
  const stringValue = Object.prototype.toString.call(value)
  return stringValue === '[object RegExp]' || stringValue === '[object Date]'
}
