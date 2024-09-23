# `macros!`

Mới bắt đầu với Rust chúng ta thường sử dụng rất nhiều macro như `println!`.

Thực chất có 3 loại macro trong Rust.

- Custom `#[derive]` macros that specify code added with the derive attribute used on structs and enums
- Attribute-like macros that define custom attributes usable on any item
- Function-like macros that look like function calls but operate on the tokens specified as their argument

### Nội dung:

- [Khác nhau giữa Macros và Functions](./macros-vs-functions.md)
- [Standard Macros](./standard-macros.md)
- [`println!`](./println.md)
- [`format!`](./format.md)
- [`todo!`](./todo.md)
- [`macro_rules!`](./macro_rules.md)