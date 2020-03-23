
# rdf-datatype-validation

Validate that RDF literal term values correspond to their declared datatype.


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

TODO

### `validateDataset`

TODO
