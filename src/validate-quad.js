const validateTerm = require('./validate-term')

/**
 * Validate that a quad's object value is valid in regards to its declared
 * datatype.
 *
 * @param {Quad} quad - The quad to validate
 * @returns {boolean} - `true` if valid, `false` otherwise
 */
function validateQuad (quad) {
  return validateTerm(quad.object)
}

module.exports = validateQuad
