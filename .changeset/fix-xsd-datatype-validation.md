---
"rdf-validate-datatype": minor
---

Correct XSD datatype validations (fixes #35):
- `xsd:int`: fixed bounds to [-2147483648, 2147483647]
- `xsd:gDay`: enforce `---` prefix according to XML Schema Part 2 specification
- `xsd:gMonthDay`: enforce `--` prefix according to XML Schema Part 2 specification
- `xsd:decimal`, `xsd:float`, `xsd:double`: disallow invalid multiple/duplicate sign prefixes
