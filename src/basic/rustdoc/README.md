# Viết Docs

Rust mặc định được phát hành cùng với một công cụ gọi là `rustdoc` hay `cargo doc`. 
Giúp generate document cho Rust project.

## Cơ bản

Thử viết 1 crate đơn giản và document nó:

```bash
cargo new duyet_lib --lib
cd duyet_lib
```

Trong `src/lib.rs`, Cargo đã generate sẵn 1 đoạn code, hãy xóa và thay nó bằng:

```rust
/// foo is a function
fn foo() {}
```

Bây giờ hãy dùng lệnh sau để generate document và xem nó trên trình duyệt:

```bash
cargo doc --open
```

`rustdoc` đọc mọi comment `///`, `//!` và generate document theo cấu trúc của project.
Nôi dung của document được viết bằng Markdown.

Hãy xem trang [viết comment sao cho đúng](../code-comment/README.md) 
và [Doc comments](../code-comment/doc-comment.md) 
để biết thêm về cách viết comment doc sao cho chuẩn.

## References

- [What is rustdoc?](https://doc.rust-lang.org/rustdoc/what-is-rustdoc.html)
- [How to write documentation](https://doc.rust-lang.org/rustdoc/how-to-write-documentation.html)
