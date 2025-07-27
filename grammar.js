module.exports = grammar({
  name: "firm",
  rules: {
    // File consist of entity and schema blocks
    source_file: ($) => repeat(choice($.entity_block, $.schema_block)),

    // Entity block: contact john_doe { ... }
    entity_block: ($) => seq($.entity_type, $.entity_id, $.block),

    // Schema block: schema invoice { ... }
    schema_block: ($) => seq("schema", $.schema_name, $.block),

    // Block can contain fields or nested blocks
    block: ($) => seq("{", repeat(choice($.field, $.nested_block)), "}"),

    // Nested block: field { name = "title" }
    nested_block: ($) => seq($.block_type, $.block),

    // Regular field assignment: name = "value"
    field: ($) => seq($.field_name, "=", $.value),

    // Named identifiers
    identifier: ($) => token(prec(-1, /[a-zA-Z_][a-zA-Z0-9_]*/)),
    schema_name: ($) => $.identifier,
    block_type: ($) => $.identifier,
    entity_type: ($) => $.identifier,
    entity_id: ($) => $.identifier,
    field_name: ($) => $.identifier,

    // Value tokens
    value: ($) =>
      choice(
        $.boolean,
        $.string,
        $.number,
        $.currency,
        $.reference,
        $.list,
        $.datetime,
        $.date,
      ),

    // Logic (true, false)
    boolean: ($) => choice("true", "false"),

    // Single and multi-line string ("Hello world!", """Hello world!""")
    string: ($) =>
      choice(
        /"[^"]*"/, // Regular single-line strings
        $.multiline_string, // Separate rule for multiline
      ),

    // Multiline string with proper escaping
    multiline_string: ($) =>
      token(
        seq(
          '"""',
          repeat(
            choice(
              /[^"]/, // Any non-quote character
              /"[^"]/, // One quote not followed by quote
              /""[^"]/, // Two quotes not followed by quote
            ),
          ),
          '"""',
        ),
      ),

    // Number (5, 9.95)
    number: ($) => /\d+(\.\d+)?/,

    // Money (500 USD, 9.95 DKK)
    currency: ($) =>
      token(
        seq(
          /\d+(\.\d+)?/, // Amount
          /\s+/, // Whitespace (required)
          /[A-Z]{3}/, // ISO 4217 currency code
        ),
      ),

    // Reference to an entity (contact.john_doe) or field (contact.john_doe.name)
    reference: ($) =>
      seq($.identifier, ".", $.identifier, optional(seq(".", $.identifier))),

    // Homogenous list of items (["hello", "world"])
    list: ($) =>
      seq(
        "[",
        optional(
          seq(
            $.value,
            repeat(seq(",", $.value)),
            optional(","), // Allow trailing comma
          ),
        ),
        "]",
      ),

    // ISO 8601 date: 2025-01-15
    date: ($) => token(/\d{4}-\d{2}-\d{2}/),

    // Natural datetime: 2025-01-15 at 09:00 or 2025-01-15 at 09:00 UTC+1
    datetime: ($) =>
      seq(
        $.date, // 2025-01-15
        "at", // "at" keyword
        $.time, // 09:00
        optional($.timezone), // Optional timezone (UTC, UTC+1, UTC-7)
      ),

    // Time (09:00, 9:00)
    time: ($) => token(/\d{1,2}:\d{2}/), // 09:00 or 9:00

    // Timezone (UTC, UTC+1, UTC-7)
    timezone: ($) =>
      token(
        seq(
          "UTC",
          optional(
            seq(
              choice("+", "-"),
              /\d{1,2}/, // 1, 7, 12 etc.
            ),
          ),
        ),
      ),

    // Comments
    comment: ($) =>
      token(
        choice(
          seq("//", /.*/), // Single line comment
          seq("/*", repeat(/[^*]|\*[^/]/), "*/"), // Multi-line comment
        ),
      ),
  },

  // Whitespace and comments
  extras: ($) => [/\s+/, $.comment],
});
