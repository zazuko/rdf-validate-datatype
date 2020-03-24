/* eslint-env mocha */
const assert = require('assert')
const $rdf = require('@rdfjs/data-model')

const { validateTerm } = require('../index')

describe('#validateTerm', () => {
  it('returns true for terms without datatype', () => {
    const term = $rdf.literal('test')
    const isValid = validateTerm(term, null)
    assert.strictEqual(isValid, true)
  })

  it('throws on named nodes', () => {
    const term = $rdf.namedNode('test')
    assert.throws(() => validateTerm(term), Error)
  })

  it('throws on blank nodes', () => {
    const term = $rdf.blankNode()
    assert.throws(() => validateTerm(term), Error)
  })
})
