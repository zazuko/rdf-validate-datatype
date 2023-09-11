import assert from 'assert'
import $rdf from '@rdfjs/data-model'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { validators, validateTerm } from '../index.js'

describe('validator registry', () => {
  it('can register a new datatype', () => {
    const datatype = $rdf.namedNode('my-datatype')

    validators.register(datatype, value => value.startsWith('X-'))

    const validTerm = $rdf.literal('X-test', datatype)
    assert.strictEqual(validateTerm(validTerm), true)

    const invalidTerm = $rdf.literal('test', datatype)
    assert.strictEqual(validateTerm(invalidTerm), false)
  })

  it('can override an existing datatype', () => {
    validators.register(xsd.date, () => true)

    const term = $rdf.literal('banana', xsd.date)
    assert.strictEqual(validateTerm(term), true)
  })
})
