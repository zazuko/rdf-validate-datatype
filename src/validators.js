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

module.exports = validators
