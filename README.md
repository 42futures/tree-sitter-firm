# Firm language grammar

Basic DSL grammar and parsing for the Firm language using Tree-sitter.

## Introduction

Firm is a domain-specific language designed to declare business entities and their relationships in a simple, readable format.

The goal is to provide a syntax that is both simple and extensible, focusing specifically on what's required for mapping business activities like contacts, leads, projects, and custom workflows.

## Using the parser

Add the tree-sitter-firm parser to your Rust project:

```toml
[dependencies]
tree-sitter = "0.25"
tree-sitter-firm = { git = "https://github.com/42futures/tree-sitter-firm" }
```

Parse Firm source code:

```rust
use tree_sitter::{Language, Parser, Tree};

pub fn get_language() -> Language {
    tree_sitter_firm::LANGUAGE.into()
}

pub fn parse_dsl(source: &str) -> Result<Tree, Box<dyn std::error::Error>> {
    let mut parser = Parser::new();
    parser.set_language(&get_language())?;

    let tree = parser.parse(source, None).ok_or("Failed to parse DSL")?;
    Ok(tree)
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let source_code = r#"
        contact john_doe {
            name = "John Doe"
            email = "john@example.com"
        }
    "#;

    let tree = parse_dsl(source_code)?;
    println!("Parsed AST: {}", tree.root_node().to_sexp());
    Ok(())
}
```

## Building the parser

The parser is generated with Tree-sitter using:

```bash
npx tree-sitter generate
```

## Language design

The Firm language is inspired by HashiCorp Configuration Language (HCL) but simplified for business entity modeling. Firm keeps HCL's clean block syntax and nested blocks while reducing complexity with a more restricted grammar and focused type system.

Why not YAML or JSON? The Firm language is optimized for readability and compactness while retaining rich typing information. The block syntax is more scannable than nested YAML, less verbose than JSON, and includes native support for entity relationships and custom schema definitions.

Because the syntax is intentionally simple, the Firm language is easy to write by hand, straightforward to parse programmatically, and simple to generate from tooling. This makes it suited for both human authoring and machine generation in business workflows.

## Basic syntax

Firm source files consist of blocks that define entities, schemas, and their relationships.

The parser is agnostic to file and folder organization. You can structure your `.firm` files however makes sense for your project, whether that's all entities in one file, organized by type, or grouped by domain.

### Entity definitions

Define business entities with a type and identifier:

```firm
// Basic entity structure:
entity_type entity_id {
  field_name = value
}

// Examples:
contact john_doe {
  name = "John Doe"
  email = "john@doe.com"
  active = true
}

company megacorp {
  name = "MegaCorp Inc"
  website = "https://megacorp.com"
}
```

### Value types

Firm supports several basic value types:

```firm
entity example {
  // Strings (quoted)
  name = "John Doe"

  // Multi-line strings (triple quoted)
  description = """
  A detailed description:
  It spans multiple lines.
  """

  // Numbers (integers and floats)
  age = 42
  rating = 9.5

  // Booleans (unquoted)
  active = true
  verified = false

  // Currency
  salary = 42000 USD

  // Dates and times
  created_at = 2025-07-26
  last_meeting = 2025-07-26 at 15:00
  next_meeting = 2025-07-29 at 9:00 UTC+3

  // Lists
  skills = ["rust", "javascript", "leadership"]
  priorities = [1, 2, 3, 5, 8]

  // References to other entities
  role = role.cto

  // References to other entity fields
  role_name = role.cto.name
}
```

### Currency

Currency values combine a numeric amount with an ISO 4217 three-letter currency code, separated by a space:

```firm
project website_redesign {
    budget = 50000 USD
    deposit = 10000.50 EUR
    hourly_rate = 150 GBP
}

invoice inv_001 {
    total = 15750.25 USD
    tax = 1575.03 USD
}
```

**Constraints:**

- Currency codes must be exactly three uppercase letters (e.g., USD, EUR, GBP, JPY)
- Numbers can be integers or floats
- Single space required between amount and currency code

### Dates and time

Firm supports two time formats designed for readability while maintaining precision:

```firm
project website_redesign {
    // Simple dates
    start_date = 2025-02-01
    deadline = 2025-06-15

    // Date times with local timezone (assumed)
    kickoff_meeting = 2025-02-01 at 09:00
    team_standup = 2025-02-02 at 9:15

    // Date times with explicit UTC offset
    client_call = 2025-02-05 at 16:00 UTC-8
    demo_presentation = 2025-03-15 at 14:30 UTC+1
    api_cutoff = 2025-06-15 at 23:59 UTC
}
```

**Date format:** `YYYY-MM-DD` (ISO 8601 date format)

**Date time format:** `YYYY-MM-DD at h:mm` or `YYYY-MM-DD at hh:mm`

**Timezone specification:** Optional UTC offset (`UTC`, `UTC+1`, `UTC-7`, etc.)

### References

Reference other entities using dot notation:

```firm
// Entity references
contact john_doe {
  // Reference to role
  role = role.cto

  // Reference to company
  company = company.megacorp
}

// Field references (access fields from other entities)
lead important_deal {
  client_email = contact.john_doe.email
  client_name = contact.john_doe.name
}
```

### Comments

Support for both single-line and multi-line comments:

```firm
// Single line comment
contact john_doe {
    name = "John Doe" // End-of-line comment

    /*
      Multi-line comment
      for detailed explanations
    */
    email = "john@example.com"
}
```

### Schema definitions

You can define entity types with schemas:

```firm
schema project {
  name = "Project Schema"

  // Each field in the schema is a nested block
  field {
    name = "title"
    type = "string"
    required = true
  }

  field {
    name = "team_members"
    type = "list<entity_reference>"
    required = true
  }

  field {
    name = "budget"
    type = "currency"
    required = false
  }
}

// Use the custom schema
project website_redesign {
  title = "Website Redesign"
  budget = 50000.0 USD
  team_members = [contact.john_doe, contact.jane_smith]
  tags = ["web", "design", "urgent"]
}
```

### Naming conventions

Naming conventions loosely follow Rust conventions because the Firm toolchain is implemented in Rust:

- Entity types: `snake_case` (`contact`, `lead`, `custom_entity`)
- Entity IDs: `snake_case` (`john_doe`, `important_deal`)
- Field names: `snake_case` (`first_name`, `created_at`)
- String values: Any characters within quotes (`"Hello World!"`)
- References: Match existing entity IDs (`contact.john_doe`)

## Licensing

Firm is dual-licensed:

- **Open Source:** AGPL-3.0 for open source projects
- **Commercial:** Commercial license for proprietary use

If you want to use Firm in a proprietary application or service without
open-sourcing your code, contact 42futures for a commercial license.
