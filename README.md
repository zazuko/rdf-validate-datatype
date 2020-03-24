
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

### `validateDataset`

TODO
