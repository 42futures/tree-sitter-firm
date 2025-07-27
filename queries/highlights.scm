; Comments
(comment) @comment

; Entity structure
(entity_type (identifier) @keyword)
(entity_id (identifier) @variable)

; Field names
(field_name (identifier) @property)

; String values
(string) @string

; Numbers
(number) @number

; Currency
(currency) @number

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
