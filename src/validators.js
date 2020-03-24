const { xsd } = require('@tpluscode/rdf-ns-builders')
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

validators.register(xsd.integer, value => {
  const parsed = parseInt(value)
  return (
    /^(\+|-)?\d+$/.test(value) &&
    !isNaN(parsed) &&
    parsed >= -2147483648 &&
    parsed <= 2147483647
  )
})

validators.register(xsd.boolean, value => (
  value === '1' ||
  value === 'true' ||
  value === '0' ||
  value === 'false'
))

validators.register(xsd.decimal, value => /^(\+|-)?\d+(\.\d+)?$/.test(value))

validators.register(xsd.float, validateFloat)
validators.register(xsd.double, validateFloat)

function validateFloat (value) {
  return (
    value === 'INF' ||
    value === '-INF' ||
    value === 'NaN' ||
    /^(\+|-)?\d+(\.\d+)?((E|e)(\+|-)?\d+)?$/.test(value)
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
validators.register(xsd.hexBinary, value => true)

// TODO
validators.register(xsd.base64Binary, value => true)

// TODO
validators.register(xsd.anyURI, value => true)

// TODO
validators.register(xsd.QName, value => true)

module.exports = validators
