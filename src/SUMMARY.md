# Table of Contents

* [Introduction](README.md)
* [Who is using?](who-is-using.md)

---

# Cơ bản

- [Variables](./basic/variables.md)
- [Cargo](./basic/cargo/INDEX.md)
- [Packages và Crates](./basic/package-crate/INDEX.md)
  - [Package layout](./basic/package-crate/package-layout.md)
  - [Crate](./basic/package-crate/crate.md)
  - [use crate](./basic/package-crate/use-crate/README.md)
    - [use self, use super](./basic/package-crate/use-crate/self-super.md)
    - [pub use](./basic/package-crate/use-crate/pub-use.md)
- [Ownership](./basic/ownership.md)
- [Variables](./basic/variables.md)
- [Vec](./basic/vec/INDEX.md)
  - [Iter]()
  - [Sử dụng Enum để chứa nhiều loại dữ liệu]()
- [Box](./basic/box.md)
- [Option](./basic/option.md)
  - [`unwrap()`](./basic/unwrap.md)
  - [`expect()`](./basic/expect.md)
  - [`unwrap_or_default()`](./basic/unwrap_or_default.md)
  - [if let Some(x) = x](./basic/if_let_some.md)
- [Result](./basic/result.md)
  - [Convert `Result` sang `Option`](./basic/result-to-option.md)
  - [Toán tử `?`](./basic/question-mark.md)
- [`/// code comment`](./basic/code-comment.md)
- [Struct](./basic/struct.md)
- [Trait](./basic/trait.md)
  - [Copy, Clone](./basic/copy-clone.md)
  - [FromStr](./basic/fromstr.md)
  - [Display]()
- [Enum]()
- [Turbofish `::<>`](./basic/turbofish.md)
- [macros!](./basic/macro/README.md)
  - [println!](./basic/macro/println.md)
  - [format!](./basic/macro/format.md)
  - [macro_rules!]()
- [Rc, Arc]()

---

# Crates hay dùng

- [tokio]()
- [actix-web]()
- [anyhow]()
- [serde]()
- [clap]()
- [log]()
- [config]()
- [async_trait]()
- [lazy_static]()
- [indoc]()

---

# Design patterns

- [Behavioural Patterns](./design-pattern/behavioural/README.md)
  - [Strategy Pattern](./design-pattern/behavioural/strategy.md)
  - [Command Pattern](./design-pattern/behavioural/command.md)
- [Creational Patterns](./design-pattern/creational/README.md)
  - [Builder Pattern](./design-pattern/creational/builder.md)
- [Structural Patterns](./design-pattern/structural/README.md)
  - [Prefer Small Crates](./design-pattern/structural/small-rates.md)

---

# Rust Idioms

[Use borrowed types for arguments]()

[Concatenating strings with `format!`]()

[Constructor]()

[The Default Trait]()

[Finalisation in destructors]()

[Temporary mutability]()

