# Table of Contents

* [Introduction](README.md)
* [Who is using?](who-is-using.md)

---

# Cơ bản

- [Variables](./basic/variables/README.md)
  - [mut](./basic/variables/mut.md)
  - [uninitialized variable](./basic/variables/uninitialized.md)

- [Closure](./basic/closure.md)

- [Cargo](./basic/cargo/README.md)

- [Packages và Crates](./basic/package-crate/README.md)
  - [Package layout](./basic/package-crate/package-layout.md)
  - [Crate](./basic/package-crate/crate.md)
  - [use crate](./basic/package-crate/use-crate/README.md)
    - [use self, use super](./basic/package-crate/use-crate/self-super.md)
    - [pub use](./basic/package-crate/use-crate/pub-use.md)
  - [Preludes](./basic/package-crate/preludes.md)

- [Ownership](./basic/ownership.md)

- [Generics](./basic/generics/README.md)
  - [Generic Functions](./basic/generics/functions.md)
  - [Generic Implementation](./basic/generics/impl.md)
  - [Generic Trait](./basic/generics/trait.md)
  - [Bounds](./basic/generics/bounds.md)
  - [where](./basic/generics/where.md)

- [Vec](./basic/vec/INDEX.md)
  - [Iter]()
  - [Sử dụng Enum để chứa nhiều loại dữ liệu]()

- [Box](./basic/box.md)

- [Option](./basic/option/README.md)
  - [`unwrap()`](./basic/option/unwrap.md)
  - [`expect()`](./basic/option/expect.md)
  - [`unwrap_or_default()`](./basic/option/unwrap_or_default.md)
  - [if let Some(x) = x](./basic/option/if_let_some.md)

- [Result](./basic/result/README.md)
  - [Convert `Result` sang `Option`](./basic/result/result-to-option.md)
  - [Toán tử `?`](./basic/result/question-mark.md)

- [`/// code comment`](./basic/code-comment.md)

- [Struct](./basic/struct.md)

- [Trait](./basic/trait/README.md)
  - [Supertraits](./basic/trait/supertraits.md)
  - [Copy, Clone](./basic/trait/copy-clone.md)
  - [String và &str](./basic/trait/string-str.md)
  - [FromStr](./basic/trait/fromstr.md)
  - [Display]()

- [Enum](./basic/enum/README.md)
  - [match Enum](./basic/enum/match.md)
  - [Mang Variants ra ngoài scope của Enum](./basic/enum/use-variants.md)
  - [impl Enum](./basic/enum/impl.md)

- [Turbofish `::<>`](./basic/turbofish.md)

- [macros!](./basic/macro/README.md)
  - [Macros mặc định](./basic/macro/standard-macros.md)
  - [println!](./basic/macro/println.md)
  - [format!](./basic/macro/format.md)
  - [macro_rules!]()

- [match](./basic/match/README.md)
  - [Matching giá trị](./basic/match/literals.md)
  - [Matching Named Variables](./basic/match/named-vars.md)
  - [Matching Multiple](./basic/match/multiple.md)

- [#[attributes]](./basic/attr.md)

- [Xử lý lỗi](./basic/error-handling/README.md)
  - [panic](./basic/error-handling/panic.md)
  - [Option](./basic/error-handling/option.md)
  - [Result](./basic/error-handling/result.md)
    - [Result map](./basic/error-handling/result-map.md)
    - [Result alias](./basic/error-handling/result-alias.md)
  - [Custom error]()
  - [Boxing error]()

- [Smart Pointers]()
  - [Box<T>]()
  - [Rc<T>, Reference Counted]()

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

# Rust Idioms

- [Use borrowed types for arguments]()
- [Concatenating strings with `format!`]()
- [Constructor]()
- [The Default Trait]()
- [Finalisation in destructors]()
- [Temporary mutability]()
