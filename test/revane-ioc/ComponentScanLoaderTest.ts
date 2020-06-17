import * as path from 'path'
import * as test from 'tape-catch'
import ComponentScanLoader from '../../src/revane-ioc/loaders/ComponentScanLoader'

test('should do component scan without filters', (t) => {
  t.plan(8)

  const basePackage = path.join(__dirname, '../../../testdata/scan')
  const options = {
    basePackage,
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  return componentScanResolver.load(options, basePackage)
    .then((beanDefinitions) => {
      t.strictEquals(beanDefinitions.length, 4)
      const scan1 = findDefinition(beanDefinitions, 'scan1')
      t.strictEquals(scan1.scope, 'singleton')
      const scan2 = findDefinition(beanDefinitions, 'scan2')
      t.strictEquals(scan2.scope, 'singleton')
      t.deepEquals(scan1.dependencyIds, [{ ref: 'test6' }])
      const scan3 = findDefinition(beanDefinitions, 'scan3')
      t.strictEquals(scan3.scope, 'singleton')
      t.deepEquals(scan3.dependencyIds, [{ ref: 'test6' }])
      const scan4 = findDefinition(beanDefinitions, 'scan4')
      t.strictEquals(scan4.scope, 'singleton')
      t.deepEquals(scan4.dependencyIds, [])
    })
    .catch((err) => t.error(err))
})

test('should do component scan with exclude filter', (t) => {
  t.plan(1)

  const basePackage = path.join(__dirname, '../../../testdata/scan')
  const options = {
    basePackage,
    excludeFilters: [{
      type: 'regex',
      regex: '.*'
    }],
    componentScan: true
  }

  const componentScanLoader = new ComponentScanLoader()
  return componentScanLoader.load(options, basePackage)
    .then((beanDefinitions) => {
      t.strictEquals(beanDefinitions.length, 0)
    })
})

test('should return correct type', (t) => {
  t.plan(1)

  const componentScanLoader = new ComponentScanLoader()

  t.strictEquals(componentScanLoader.type(), 'scan')
})

test('should throw error on require error', (t) => {
  t.plan(1)

  const basePackage = path.join(__dirname, '../../../testdata/loadFailure')
  const options = {
    basePackage,
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  return componentScanResolver.load(options, basePackage)
    .catch((error) => t.equals(error.code, 'REV_ERR_MODULE_LOAD_ERROR'))
})

test('should throw error on undefined module', (t) => {
  t.plan(1)

  const basePackage = path.join(__dirname, '../../../testdata/loadFailure2')
  const options = {
    basePackage,
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  return componentScanResolver.load(options, basePackage)
    .catch((error) => t.equals(error.code, 'REV_ERR_MODULE_LOAD_ERROR'))
})

test('should do component scan with include filter', (t) => {
  t.plan(1)

  const basePackage = path.join(__dirname, '../../../testdata/scan')
  const options = {
    basePackage,
    includeFilters: [{
      type: 'regex',
      regex: '.*'
    }],
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  return componentScanResolver.load(options, basePackage)
    .then((beanDefinitions) => {
      t.strictEquals(beanDefinitions.length, 4)
    })
    .catch((err) => t.error(err))
})

function findDefinition (definitions, name) {
  for (const definition of definitions) {
    if (definition.id === name) {
      return definition
    }
  }
  throw new Error()
}
