# Sử dụng README.md làm crate document

Nội dung comment dưới đây trong `src/lib.rs` được gọi là crate document, 
được render thành nội dung trong trang chủ doc của library.

File: src/lib.rs

```rust
//! This is crate document
//!
//! # Usage
//!
//! ```
//! [dependencies]
//! duyet_lib = "0.9"
//! ```
//! ...
```

Và nội dung này cũng thường sẽ giống với `README.md` để hiển thị trên Github.
Một cách để tránh lặp lại nội dung và đồng bộ với nhau là `rustdoc` render trực tiếp
nội dung từ `README.md`.

File: src/lib.rs

```rust
#[doc = include_str!("../README.md")]
```

File: README.md

``````markdown
This is crate document

# Usage

```
[dependencies]
duyet_lib = "0.9"
```
...
``````
