import type { Term } from '@rdfjs/types'
import { validators } from './validators.js'

/**
 * Validate that a term's value is valid in regards to its declared datatype.
 */
export function validateTerm(term: Term) {
  if (term.termType !== 'Literal') {
    throw new Error('Cannot validate non-literal terms')
  }

  const validator = validators.find(term.datatype)

  if (validator) {
    return validator(term.value)
  }

  return true
}
