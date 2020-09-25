import * as path from 'path'
import test from 'ava'
import ComponentScanLoader from '../../src/revane-ioc/loaders/ComponentScanLoader'
import { BeanDefinition } from '../../src/revane-ioc/RevaneIOC'

test('should do component scan without filters', async (t): Promise<void> => {
  t.plan(8)

  const basePackage = path.join(__dirname, '../../testdata/scan')
  const options = {
    basePackage,
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  return await componentScanResolver.load(options, basePackage)
    .then((beanDefinitions) => {
      t.is(beanDefinitions.length, 4)
      const scan1 = findDefinition(beanDefinitions, 'scan1')
      t.is(scan1.scope, 'singleton')
      const scan2 = findDefinition(beanDefinitions, 'scan2')
      t.is(scan2.scope, 'singleton')
      t.deepEqual(scan1.dependencyIds, [{ ref: 'test6' }])
      const scan3 = findDefinition(beanDefinitions, 'scan3')
      t.is(scan3.scope, 'singleton')
      t.deepEqual(scan3.dependencyIds, [{ ref: 'test6' }])
      const scan4 = findDefinition(beanDefinitions, 'scan4')
      t.is(scan4.scope, 'singleton')
      t.deepEqual(scan4.dependencyIds, [])
    })
})

test('should do component scan with exclude filter', async (t): Promise<void> => {
  const basePackage = path.join(__dirname, '../../testdata/scan')
  const options = {
    basePackage,
    excludeFilters: [{
      type: 'regex',
      regex: '.*'
    }],
    componentScan: true
  }

  const componentScanLoader = new ComponentScanLoader()
  return await componentScanLoader.load(options, basePackage)
    .then((beanDefinitions) => {
      t.is(beanDefinitions.length, 0)
    })
})

test('should return correct type', (t) => {
  const componentScanLoader = new ComponentScanLoader()

  t.is(componentScanLoader.type(), 'scan')
})

test('should throw error on require error', async (t) => {
  const basePackage = path.join(__dirname, '../../../testdata/loadFailure')
  const options = {
    basePackage,
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  await t.throwsAsync(async () => {
    await componentScanResolver.load(options, basePackage)
  }, { code: 'REV_ERR_MODULE_LOAD_ERROR' })
})

test('should throw error on undefined module', async (t) => {
  const basePackage = path.join(__dirname, '../../../testdata/loadFailure2')
  const options = {
    basePackage,
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  await t.throwsAsync(async () => {
    await componentScanResolver.load(options, basePackage)
  }, { code: 'REV_ERR_MODULE_LOAD_ERROR' })
})

test('should do component scan with include filter', async (t): Promise<void> => {
  const basePackage = path.join(__dirname, '../../testdata/scan')
  const options = {
    basePackage,
    includeFilters: [{
      type: 'regex',
      regex: '.*'
    }],
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  return await componentScanResolver.load(options, basePackage)
    .then((beanDefinitions) => {
      t.is(beanDefinitions.length, 4)
    })
})

test('should do component scan but exclude node module without dependency on revane', async (t): Promise<void> => {
  const basePackage = path.join(__dirname, '../../testdata/componentScan1')
  const options = {
    basePackage,
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  return await componentScanResolver.load(options, basePackage)
    .then((beanDefinitions) => {
      t.is(beanDefinitions.length, 0)
    })
})

test('should do component scan but exclude node module without dependency on revane #2', async (t): Promise<void> => {
  const basePackage = path.join(__dirname, '../../testdata/componentScan3')
  const options = {
    basePackage,
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  return await componentScanResolver.load(options, basePackage)
    .then((beanDefinitions) => {
      t.is(beanDefinitions.length, 0)
    })
})

test('should do component scan and detect node module with dependency on revane', async (t): Promise<void> => {
  const basePackage = path.join(__dirname, '../../testdata/componentScan2')
  const options = {
    basePackage,
    componentScan: true
  }

  const componentScanResolver = new ComponentScanLoader()
  return await componentScanResolver.load(options, basePackage)
    .then((beanDefinitions) => {
      t.is(beanDefinitions.length, 1)
    })
})

function findDefinition (definitions: BeanDefinition[], name: string): BeanDefinition {
  for (const definition of definitions) {
    if (definition.id === name) {
      return definition
    }
  }
  throw new Error()
}
