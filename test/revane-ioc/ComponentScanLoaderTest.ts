import * as path from 'path'
import * as test from 'tape-catch'
import ComponentScanLoader from '../../src/revane-ioc/loaders/ComponentScanLoader'

test('should do component scan without filters', (t) => {
  t.plan(15)

  const basePackage = path.join(__dirname, '../../../testdata')
  const options = {
    basePackage,
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  return componentScanResolver.load(options, basePackage)
    .then((beanDefinitions) => {
      t.strictEquals(beanDefinitions.length, 8)
      const scan1 = findDefinition(beanDefinitions, 'scan1')
      t.strictEquals(scan1.scope, 'singleton')
      const scan2 = findDefinition(beanDefinitions, 'scan2')
      t.strictEquals(scan2.scope, 'singleton')
      t.deepEquals(scan1.properties, [{ ref: 'test6' }])
      const test7 = findDefinition(beanDefinitions, 'test7')
      t.strictEquals(test7.scope, 'singleton')
      t.deepEquals(test7.properties, [{ ref: 'test6' }])
      const test8 = findDefinition(beanDefinitions, 'test8')
      t.strictEquals(test8.scope, 'singleton')
      t.deepEquals(test8.properties, [{ ref: 'test6' }])
      const test9 = findDefinition(beanDefinitions, 'test9')
      t.strictEquals(test9.scope, 'singleton')
      t.deepEquals(test9.properties, [])
      const scan3 = findDefinition(beanDefinitions, 'scan3')
      t.strictEquals(scan3.scope, 'singleton')
      t.deepEquals(scan3.properties, [{ ref: 'test6' }])
      const scan4 = findDefinition(beanDefinitions, 'scan4')
      t.strictEquals(scan4.scope, 'singleton')
      t.deepEquals(scan4.properties, [])
      t.deepEquals(scan4.options, { inject: [ 'test6' ] })
    })
    .catch((err) => t.error(err))
})

test('should do component scan with exclude filter', (t) => {
  t.plan(1)

  const basePackage = path.join(__dirname, '../../../testdata')
  const options = {
    basePackage,
    excludeFilters: [{
      type: 'regex',
      regex: '.*'
    }],
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  return componentScanResolver.load(options, basePackage)
    .then((beanDefinitions) => {
      t.strictEquals(beanDefinitions.length, 0)
    })
})

test('should do component scan with include filter', (t) => {
  t.plan(1)

  const basePackage = path.join(__dirname, '../../../testdata')
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
      t.strictEquals(beanDefinitions.length, 8)
    })
    .catch((err) => t.err(err))
})

function findDefinition (definitions, name) {
  for (const definition of definitions) {
    if (definition.id === name) {
      return definition
    }
  }
  throw new Error()
}
