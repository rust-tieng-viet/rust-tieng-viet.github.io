# Cargo

`cargo` là package management tool official của Rust.

`cargo` có rất nhiều tính năng hữu ích để improve code quality và nâng cao tốc độ của lập trình viên. 
`cargo` có hẳn một quyển sách riêng: [The Cargo Book](https://doc.rust-lang.org/cargo/)

Những tính năng phổ biến mà bạn sẽ phải dùng hằng ngày:

- `cargo add <crate>`: cài đặt crate mới từ <https://crates.io>, crate sẽ được thêm vào `Cargo.toml`.
- `cargo r` hoặc `cargo run`: biên dịch và chạy chương trình (`main.rs`).
- `cargo t` hoặc `cargo test`: run mọi tests (unit tests, doc tests, integration tests).
- `cargo fmt`: format code.
- `cargo clippy`: lint để bắt các lỗi phổ biến trong lập trình, code đẹp hơn, chạy nhanh hơn, etc. <https://github.com/rust-lang/rust-clippy>
