/*
 * Wrapping https://www.npmjs.com/package/he
 */

import HTMLEntities from 'he'

// Set global defaults
HTMLEntities.encode.options.encodeEverything = false
HTMLEntities.encode.options.allowUnsafeSymbols = false
HTMLEntities.encode.options.strict = false
HTMLEntities.encode.options.useNamedReferences = true

export default function encode (string) {
  return HTMLEntities.encode(string)
}
