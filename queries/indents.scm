; Indent inside blocks and nested blocks
[
  (block)
  (nested_block)
] @indent

; Indent inside lists
(list) @indent

; Outdent closing brackets
[
  "}"
  "]"
] @outdent

; Auto-indent after opening brackets
[
  "{"
  "["
] @indent.begin

; Auto-outdent before closing brackets
[
  "}"
  "]"
] @indent.end
