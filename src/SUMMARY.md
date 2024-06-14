# Table of Contents

- [Introduction](README.md)
- [Who is using?](who-is-using.md)

---

# Bắt đầu

- [Cài đặt Rust](./getting-started/installation.md)
- [Project đầu tiên](./getting-started/first-project.md)

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

- [Struct](./basic/struct.md)

- [Trait](./basic/trait/README.md)

  - [Khai báo Trait](./basic/trait/define-a-trait.md)
  - [Implement Trait cho một Type](./basic/trait/impl-trait.md)
  - [Default Implementations](./basic/trait/default-impls.md)
  - [Traits as Parameters](./basic/trait/trait-as-params.md)
  - [Trait Bound](./basic/trait/trait-bound.md)
  - [Multiple Trait Bound](./basic/trait/multiple-trait-bound.md)
  - [`where` Clauses](./basic/trait/where-clauses.md)
  - [Returning Types that Implement Traits](./basic/trait/return-impl-trait.md)
  - [Using Trait Bounds to Conditionally Implement Methods](./basic/trait/conditionally-impl.md)
  - [Blanket implementations](./basic/trait/blanked-impl.md)
  - [Trait Inheritance](./basic/trait/trait-inheritance.md)
  - [Supertraits](./basic/trait/supertraits.md)
  - [Auto Trait](./basic/trait/auto-trait.md)
  - [Copy, Clone](./basic/trait/copy-clone.md)
  - [String và &str](./basic/trait/string-str.md)
  - [FromStr](./basic/trait/fromstr.md)
  - [Display]()

- [Enum](./basic/enum/README.md)

  - [match Enum](./basic/enum/match.md)
  - [Mang Variants ra ngoài scope của Enum](./basic/enum/use-variants.md)
  - [impl Enum](./basic/enum/impl.md)
  - [`Option<T>`](./basic/enum/option/README.md)
    - [`unwrap()`](./basic/enum/option/unwrap.md)
    - [`expect()`](./basic/enum/option/expect.md)
    - [`unwrap_or_default()`](./basic/enum/option/unwrap_or_default.md)
    - [if let Some(x) = x](./basic/enum/option/if_let_some.md)
  - [`Result<T, E>`](./basic/enum/result/README.md)
    - [Convert `Result` sang `Option`](./basic/enum/result/result-to-option.md)
    - [Toán tử `?`](./basic/enum/result/question-mark.md)

- [Generics](./basic/generics/README.md)

  - [Generic Functions](./basic/generics/functions.md)
  - [Generic Struct](./basic/generics/struct.md)
  - [Generic Enum](./basic/generics/enum.md)
  - [Generic Implementation](./basic/generics/impl.md)
  - [Generic Trait](./basic/generics/trait.md)
  - [Bounds](./basic/generics/bounds.md)
  - [where](./basic/generics/where.md)

- [Vec](./basic/vec/INDEX.md)

  - [Iter]()
  - [Sử dụng Enum để chứa nhiều loại dữ liệu]()

- [`/// Viết code comment`](./basic/code-comment/README.md)

  - [Doc comments](./basic/code-comment/doc-comment.md)

- [Turbofish `::<>`](./basic/turbofish.md)

- [macros!](./basic/macro/README.md)

  - [Khác nhau giữa Macros và Functions](./basic/macro/macros-vs-functions.md)
  - [Macros mặc định](./basic/macro/standard-macros.md)
  - [println!](./basic/macro/println.md)
  - [format!](./basic/macro/format.md)
  - [todo!](./basic/macro/todo.md)
  - [macro_rules!](./basic/macro/macro_rules.md)

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

- [Viết Tests](./basic/testing/README.md)

  - [Tổ chức Tests](./basic/testing/test-organization.md)
    - [Unit Tests](./basic/testing/unit-tests.md)
    - [Integration Tests](./basic/testing/integration-tests.md)
    - [Doc Tests](./basic/testing/doc-tests.md)
  - [Xung đột biến môi trường](./basic/testing/env-conflict.md)

- [Viết Docs](./basic/rustdoc/README.md)

  - [Doc comments](./basic/code-comment/doc-comment.md)
  - [Sử dụng README.md làm crate document](./basic/rustdoc/doc-README.md)


# Nâng cao

- [Smart Pointers]()
  - [`Box<T>`](./advanced/box.md)
  - [`Rc<T>`, Reference Counted](./advanced/rc.md)
  - [Cow](./advanced/cow.md)
- [`Saturating<T>`](./advanced/saturating.md)

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
- [anyhow](./crates/anyhow.md)
- [serde](./crates/serde.md)
  - [serde_json](./crates/serde/serde_json.md)
  - [serde_toml](./crates/serde/serde_toml.md)
  - [serde_csv](./crates/serde/serde_csv.md)
  - [serde_yaml](./crates/serde/serde_yaml.md)
- [clap]()
- [log](./crates/log/README.md)
  - [env_logger](./crates/log/env_logger.md)
- [config]()
- [async_trait](./crates/async_trait.md)
- [lazy_static](./crates/lazy_static.md)
- [indoc](./crates/indoc.md)
- [rayon](./crates/rayon.md)
- [polars](./crates/polars.md)

---

# Data Engineering

- [Xử lý và phân tích dữ liệu](./data-engineering/data-processing.md)
  - [Polars](./crates/polars.md)
  - [serde](./crates/serde.md)
    - [serde_json](./crates/serde/serde_json.md)
    - [serde_toml](./crates/serde/serde_toml.md)
    - [serde_csv](./crates/serde/serde_csv.md)
    - [serde_yaml](./crates/serde/serde_yaml.md)
- [High-performance data pipeline](./data-engineering/first-data-pipeline.md)
- [Building scalable data-driven applications using Rust](./data-engineering/data-driven.md)
- [Rust as an alternative to Python for data engineering tasks](./data-engineering/rust-as-alternative-python.md)

---

# Rust Idioms

- [Functional programming]()
- [Use borrowed types for arguments]()
- [Concatenating strings with `format!`]()
- [Constructor]()
- [The Default Trait]()
- [Finalisation in destructors]()
- [Temporary mutability]()