# macros!

Mới bắt đầu với Rust chúng ta thường sử dụng rất nhiều macro như `println!`.

Thực chất có 3 loại macro trong Rust.

- Custom `#[derive]` macros that specify code added with the derive attribute used on structs and enums
- Attribute-like macros that define custom attributes usable on any item
- Function-like macros that look like function calls but operate on the tokens specified as their argument

{{#include ./macros-vs-functions.md}}

{{#include ./standard-macros.md}}
