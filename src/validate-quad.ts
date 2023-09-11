import type { Quad } from '@rdfjs/types'
import { validateTerm } from './validate-term.js'

/**
 * Validate that a quad's object value is valid in regards to its declared
 * datatype.
 */
export function validateQuad(quad: Quad) {
  return quad.object.termType !== 'Literal' || validateTerm(quad.object)
}
