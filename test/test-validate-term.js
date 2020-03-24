/* eslint-env mocha */
const assert = require('assert')
const $rdf = require('@rdfjs/data-model')
const { xsd } = require('@tpluscode/rdf-ns-builders')

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

  ;[
    ['test', xsd.string, true],

    ['1', xsd.integer, true],
    ['test', xsd.integer, false],
    ['1231343123123', xsd.integer, false, 'too large'],
    ['123x', xsd.integer, false, 'trailing string'],

    ['true', xsd.boolean, true],
    ['false', xsd.boolean, true],
    ['test', xsd.boolean, false],

    ['0.4', xsd.decimal, true],
    ['244.14', xsd.decimal, true],
    ['244', xsd.decimal, true, 'without decimal digits'],
    ['-24.4', xsd.decimal, true, 'minus sign'],
    ['+24.4', xsd.decimal, true, 'plus sign'],
    ['test', xsd.decimal, false],

    ['-1E4', xsd.float, true],
    ['1267.43233E12', xsd.float, true],
    ['12.78e-2', xsd.float, true],
    ['12', xsd.float, true],
    ['-0', xsd.float, true],
    ['0', xsd.float, true],
    ['INF', xsd.float, true],
    ['-INF', xsd.float, true],
    ['NaN', xsd.float, true],
    ['test', xsd.float, false],
    ['10e4.2', xsd.float, false],

    ['-1E4', xsd.double, true],
    ['1267.43233E12', xsd.double, true],
    ['12.78e-2', xsd.double, true],
    ['12', xsd.double, true],
    ['-0', xsd.double, true],
    ['0', xsd.double, true],
    ['INF', xsd.double, true],
    ['-INF', xsd.double, true],
    ['NaN', xsd.double, true],
    ['test', xsd.double, false],
    ['10e4.2', xsd.double, false],

    ['P1Y2M3DT10H30M', xsd.duration, true],
    ['-P120D', xsd.duration, true],
    ['P1347Y', xsd.duration, true],
    ['P1347M', xsd.duration, true],
    ['P1Y2MT2H', xsd.duration, true],
    ['P0Y1347M', xsd.duration, true],
    ['P0Y1347M0D', xsd.duration, true],
    ['-P1347M', xsd.duration, true],
    ['P-1347M', xsd.duration, false],
    ['P1Y2MT', xsd.duration, false],
    ['test', xsd.duration, false],

    ['2020-04-02', xsd.date, true],
    ['-2020-04-02', xsd.date, true],
    ['2020-04-02Z', xsd.date, true],
    ['2020-04-02+03:00', xsd.date, true],
    ['2020-04-02x', xsd.date, false],
    ['test', xsd.date, false],

    ['2020-04-02T23:33:12.234Z', xsd.dateTime, true],
    ['2020-04-02T23:33:12.234+04:00', xsd.dateTime, true],
    ['2020-04-02T23:33:12+04:00', xsd.dateTime, true],
    ['2020-04-02T23:33:12', xsd.dateTime, true],
    ['2020-04-02T23:33:12x', xsd.dateTime, false],
    ['2020-04-02T23:33', xsd.dateTime, false],
    ['test', xsd.dateTime, false],

    ['23:33:12.234', xsd.time, true],
    ['03:43:12.234Z', xsd.time, true],
    ['23:33:12.134+04:00', xsd.time, true],
    ['17:33:12.23-01:00', xsd.time, true],
    ['13:20:00-05:00', xsd.time, true],
    ['23:33:12', xsd.time, true],
    ['23:33:12x', xsd.time, false],
    ['23:33', xsd.time, false],
    ['test', xsd.time, false],

    ['12', xsd.gDay, true],
    ['30Z', xsd.gDay, true],
    ['01+01:00', xsd.gDay, true],
    ['04-12:00', xsd.gDay, true],
    ['1', xsd.gDay, false],
    ['-13', xsd.gDay, false],
    ['test', xsd.gDay, false],

    ['12', xsd.gMonth, true],
    ['03Z', xsd.gMonth, true],
    ['01+01:00', xsd.gMonth, true],
    ['04-12:00', xsd.gMonth, true],
    ['1', xsd.gMonth, false],
    ['-12', xsd.gMonth, false],
    ['test', xsd.gMonth, false],

    ['04-02', xsd.gMonthDay, true],
    ['12-22', xsd.gMonthDay, true],
    ['12-22Z', xsd.gMonthDay, true],
    ['12-22+04:00', xsd.gMonthDay, true],
    ['12-22-04:00', xsd.gMonthDay, true],
    ['2020-12-22', xsd.gMonthDay, false],
    ['-12-22', xsd.gMonthDay, false],
    ['12-22X', xsd.gMonthDay, false],
    ['test', xsd.gMonthDay, false],

    ['2020', xsd.gYear, true],
    ['-2020', xsd.gYear, true],
    ['2020Z', xsd.gYear, true],
    ['2020+04:00', xsd.gYear, true],
    ['-2020-02:00', xsd.gYear, true],
    ['2020-12-01', xsd.gYear, false],
    ['test', xsd.gYear, false],

    ['2020-12', xsd.gYearMonth, true],
    ['-2020-04', xsd.gYearMonth, true],
    ['2020-04Z', xsd.gYearMonth, true],
    ['2020-11+04:00', xsd.gYearMonth, true],
    ['-2020-05-02:00', xsd.gYearMonth, true],
    ['2020-12-01', xsd.gYearMonth, false],
    ['2020-04X', xsd.gYearMonth, false],
    ['test', xsd.gYearMonth, false]
  ].forEach(([input, datatype, expected, remark]) => {
    const datatypeName = datatype.value.split('#').slice(-1)[0]
    const titleRemark = remark ? ` (${remark})` : ''
    it(`validates ${expected ? 'valid' : 'invalid'} ${datatypeName}${titleRemark}: "${input}"`, () => {
      const term = $rdf.literal(input, datatype)
      const isValid = validateTerm(term)
      assert.strictEqual(isValid, expected)
    })
  })
})
