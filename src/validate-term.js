import { validators } from './validators.js'

/**
 * Validate that a term's value is valid in regards to its declared datatype.
 *
 * @param {Term} term - The term to validate
 * @returns {boolean} - `true` if valid, `false` otherwise
 */
export function validateTerm(term) {
  if (term.termType !== 'Literal') {
    throw new Error('Cannot validate non-literal terms')
  }

  const validator = validators.find(term.datatype)

  if (validator) {
    return validator(term.value)
  }

  return true
}
