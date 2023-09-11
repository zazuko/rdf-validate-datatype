import { validateTerm } from './validate-term.js'

/**
 * Validate that a quad's object value is valid in regards to its declared
 * datatype.
 *
 * @param {Quad} quad - The quad to validate
 * @returns {boolean} - `true` if valid, `false` otherwise
 */
export function validateQuad(quad) {
  return quad.object.termType !== 'Literal' || validateTerm(quad.object)
}
