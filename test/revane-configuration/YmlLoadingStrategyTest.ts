import test from 'ava'
import { YmlLoadingStrategy } from '../../src/revane-configuration/loading/YmlLoadingStrategy.js'
import { join } from 'node:path'

test('Soll yml Dateien laden - keine Datei für profile', async (t) => {
    t.plan(2)
    const strategy = new YmlLoadingStrategy()

    const config = await strategy.load(join(import.meta.dirname, '../../../testdata/yml/case1'), 'test')

    t.is(config.test, 42)
    t.is(config.hallo, undefined)
})

test('Soll yml Dateien laden', async (t) => {
    t.plan(2)
    const strategy = new YmlLoadingStrategy()

    const config = await strategy.load(join(import.meta.dirname, '../../../testdata/yml/case2'), 'test')

    t.is(config.test, 42)
    t.is(config.hallo, 42)
})

test('Should throw error if no file present', async (t) => {
    t.plan(1)
    const strategy = new YmlLoadingStrategy()

    try {
        await strategy.load(join(import.meta.dirname, '../../../testdata/xml'), 'test')
    } catch (err) {
        t.pass()
    }
})