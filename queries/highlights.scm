; Comments
(comment) @comment

; Entity definitions
(entity_type) @keyword
(entity_id) @variable

; Schema definitions
"schema" @type
(schema_name) @keyword

; Field names
(field_name (identifier) @property)

; String values
(string) @string

; Numbers
(number) @number

; Currency
(currency) @number.currency

; Booleans
["true" "false"] @boolean

; Dates and times
(date) @string.special
(datetime
  (date) @string.special
  (time) @string.special
  (timezone)? @string.special)

; References (contact.jane_doe, product.consulting.name)
(reference (identifier) @variable.special)

; List brackets
(list) @punctuation.bracket

; Block structure
"{" @punctuation.bracket
"}" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket

; Assignment operator
"=" @operator

; Dots in references
"." @punctuation.delimiter
