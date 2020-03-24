/* global BigInt */
const { csvw, rdf, xsd } = require('@tpluscode/rdf-ns-builders')
const { termToNTriples: toCanonical } = require('@rdfjs/to-ntriples')

/**
 * Validators registry
 */
class Registry {
  constructor () {
    this.validators = new Map()
  }

  /**
   * Register a new validator for a specific datatype.
   *
   * @param {NamedNode} datatype - Validator datatype
   * @param {Function} validatorFunc - Function to validate the term value.
   *    Takes a term value (string) and returns a boolean describing if the
   *    value is valid in regards to the validator's datatype.
   * @returns {void}
   */
  register (datatype, validatorFunc) {
    this.validators.set(toCanonical(datatype), validatorFunc)
  }

  /**
   * Find validator for a given datatype.
   *
   * @param {NamedNode | null} datatype - The datatype
   * @returns {Function | null} - The validation function, if found. `null`
   *    otherwise.
   */
  find (datatype) {
    if (!datatype) {
      return null
    }

    return this.validators.get(toCanonical(datatype))
  }
}

const validators = new Registry()

validators.register(xsd.string, value => true)

const signSeg = '(\\+|-)?'
const integerPattern = new RegExp(`^${signSeg}\\d+$`)

validators.register(xsd.integer, value => integerPattern.test(value))

validators.register(xsd.nonNegativeInteger, value => (
  integerPattern.test(value) &&
  BigInt(value) >= BigInt('0')
))

validators.register(xsd.positiveInteger, value => (
  integerPattern.test(value) &&
  BigInt(value) > BigInt('0')
))

validators.register(xsd.nonPositiveInteger, value => (
  integerPattern.test(value) &&
  BigInt(value) <= BigInt('0')
))

validators.register(xsd.negativeInteger, value => (
  integerPattern.test(value) &&
  BigInt(value) < BigInt('0')
))

validators.register(xsd.int, value => (
  integerPattern.test(value) &&
  BigInt(value) >= BigInt('-2147483647') &&
  BigInt(value) <= BigInt('2147483648')
))

validators.register(xsd.unsignedInt, value => (
  integerPattern.test(value) &&
  BigInt(value) >= BigInt('0') &&
  BigInt(value) <= BigInt('4294967295')
))

validators.register(xsd.long, value => (
  integerPattern.test(value) &&
  BigInt(value) >= BigInt('-9223372036854775808') &&
  BigInt(value) <= BigInt('9223372036854775807')
))

validators.register(xsd.unsignedLong, value => (
  integerPattern.test(value) &&
  BigInt(value) >= BigInt('0') &&
  BigInt(value) <= BigInt('18446744073709551615')
))

validators.register(xsd.short, value => (
  integerPattern.test(value) &&
  BigInt(value) >= BigInt('-32768') &&
  BigInt(value) <= BigInt('32767')
))

validators.register(xsd.unsignedShort, value => (
  integerPattern.test(value) &&
  BigInt(value) >= BigInt('0') &&
  BigInt(value) <= BigInt('65535')
))

validators.register(xsd.byte, value => (
  integerPattern.test(value) &&
  BigInt(value) >= BigInt('-128') &&
  BigInt(value) <= BigInt('127')
))

validators.register(xsd.unsignedByte, value => (
  integerPattern.test(value) &&
  BigInt(value) >= BigInt('0') &&
  BigInt(value) <= BigInt('255')
))

validators.register(xsd.boolean, value => (
  value === '1' ||
  value === 'true' ||
  value === '0' ||
  value === 'false'
))

const decimalSeg = `${signSeg}\\d+(\\.\\d+)?`

const decimalPattern = new RegExp(`^${signSeg}${decimalSeg}$`)
validators.register(xsd.decimal, value => decimalPattern.test(value))

validators.register(xsd.float, validateFloat)
validators.register(xsd.double, validateFloat)

const floatPattern = new RegExp(`^${signSeg}${decimalSeg}((E|e)(\\+|-)?\\d+)?$`)
function validateFloat (value) {
  return (
    value === 'INF' ||
    value === '-INF' ||
    value === 'NaN' ||
    floatPattern.test(value)
  )
}

const dateSignSeg = '-?'
const durationYearsSeg = '\\d+Y'
const durationMonthsSeg = '\\d+M'
const durationDaysSeg = '\\d+D'
const durationHoursSeg = '\\d+H'
const durationMinutesSeg = '\\d+M'
const durationSecondsSeg = '\\d+(\\.\\d+)?S'
// All the segments are optional, but at least one of them must be specified.
// TODO: Is there a cleaner way to specify this?
const durationTimeSeg = `(T(${durationHoursSeg})(${durationMinutesSeg})?(${durationSecondsSeg})?)|((${durationHoursSeg})?(${durationMinutesSeg})(${durationSecondsSeg})?)|((${durationHoursSeg})?(${durationMinutesSeg})?(${durationSecondsSeg}))`
const durationSeg = `${dateSignSeg}P(${durationYearsSeg})?(${durationMonthsSeg})?(${durationDaysSeg})?(${durationTimeSeg})?`

const durationPattern = new RegExp(`^${durationSeg}$`)
validators.register(xsd.duration, value => durationPattern.test(value))

const yearSeg = `${dateSignSeg}\\d{4}`
const timezoneSeg = '(((\\+|-)\\d{2}:\\d{2})|Z)?'
const monthSeg = '\\d{2}'
const daySeg = '\\d{2}'
const dateSeg = `${yearSeg}-${monthSeg}-${daySeg}`
const timeSeg = '\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?'
const dateTimeSeg = `${dateSeg}T${timeSeg}${timezoneSeg}`

const dateTimePattern = new RegExp(`^${dateTimeSeg}$`)
validators.register(xsd.dateTime, value => dateTimePattern.test(value))

const datePattern = new RegExp(`^${dateSeg}${timezoneSeg}$`)
validators.register(xsd.date, value => datePattern.test(value))

const dayPattern = new RegExp(`^${daySeg}${timezoneSeg}$`)
validators.register(xsd.gDay, value => dayPattern.test(value))

const monthPattern = new RegExp(`^${monthSeg}${timezoneSeg}$`)
validators.register(xsd.gMonth, value => monthPattern.test(value))

const monthDayPattern = new RegExp(`^${monthSeg}-${daySeg}${timezoneSeg}$`)
validators.register(xsd.gMonthDay, value => monthDayPattern.test(value))

const yearPattern = new RegExp(`^${yearSeg}${timezoneSeg}$`)
validators.register(xsd.gYear, value => yearPattern.test(value))

const yearMonthPattern = new RegExp(`^${yearSeg}-${monthSeg}${timezoneSeg}$`)
validators.register(xsd.gYearMonth, value => yearMonthPattern.test(value))

const timePattern = new RegExp(`^${timeSeg}${timezoneSeg}$`)
validators.register(xsd.time, value => timePattern.test(value))

// TODO
validators.register(xsd.anyAtomicType, value => true)
validators.register(xsd.anyURI, value => true)
validators.register(xsd.base64Binary, value => true)
validators.register(xsd.dateTimeStamp, value => true)
validators.register(xsd.dayTimeDuration, value => true)
validators.register(xsd.yearhMonthDuration, value => true)
validators.register(xsd.hexBinary, value => true)
validators.register(xsd.QName, value => true)
validators.register(xsd.normalizedString, value => true)
validators.register(xsd.token, value => true)
validators.register(xsd.language, value => true)
validators.register(xsd.Name, value => true)
validators.register(xsd.NMTOKEN, value => true)
validators.register(rdf.xml, value => true)
validators.register(rdf.html, value => true)
validators.register(csvw.json, value => true)

module.exports = validators
