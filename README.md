
# rdf-datatype-validation

Validate that RDF literal term values correspond to their declared datatype.

[![Build Status](https://travis-ci.org/zazuko/rdf-datatype-validation.svg?branch=master)](https://travis-ci.org/zazuko/rdf-datatype-validation)


## Install

`$ npm install rdf-datatype-validation`


## Usage

### `validateTerm`

```javascript
import { validateTerm } from 'rdf-datatype-validation'
import rdf from '@rdfjs/data-model'
import { xsd } from '@tpluscode/rdf-ns-builders'

const term = rdf.literal('test')
const isValid = validateTerm(term) // -> true

const term = rdf.literal('2019-01-01', xsd.date)
const isValid = validateTerm(term) // -> true

const term = rdf.literal('invalid date', xsd.date)
const isValid = validateTerm(term) // -> false
```

### `validateQuad`

`validateQuad` validates that the `.object` of a given quad is valid in regards
to its declared datatype.

```javascript
import { validateQuad } from 'rdf-datatype-validation'
import rdf from '@rdfjs/data-model'
import { schema, xsd } from '@tpluscode/rdf-ns-builders'

const quad = rdf.quad(
  rdf.namedNode('bob'),
  schema.birthDate,
  rdf.literal('2019-01-01', xsd.date)
)
const isValid = validateQuad(term) // -> true

const quad = rdf.quad(
  rdf.namedNode('bob'),
  schema.birthDate,
  rdf.literal('invalid date', xsd.date)
)
const isValid = validateQuad(term) // -> false
```

### Configuring validators

Datatype validators are stored in a registry. They can be changed at runtime.

```javascript
import { validators, validateTerm } from 'rdf-datatype-validation'
import rdf from '@rdfjs/data-model'
import { xsd } from '@tpluscode/rdf-ns-builders'

// Register a new datatype
const myDatatype = rdf.namedNode('my-datatype')
validators.register(myDatatype, value => value.startsWith('X-'))
validateTerm(rdf.literal('X-test', myDatatype)) // -> true
validateTerm(rdf.literal('test', myDatatype)) // -> false

// Override an existing datatype
validators.register(xsd.date, value => true)
validateTerm(rdf.literal('banana', xsd.date)) // -> true
```
