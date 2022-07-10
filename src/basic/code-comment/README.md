# `/// code comment` sao cho đúng

Comment sao cho đúng để đồng đội bớt chửi.

```rust
// hello, world
```

## Regular comments 

Trong Rust comment bắt đầu bằng 2 slashes `//` được gọi là *Regular comments*,
chú thích cho một đoạn code hoặc biểu thức theo sau nó.
Compiler sẽ không quan tâm đến các Regular comments này.  

```rust
fn main() {
  // I’m feeling lucky today
  let lucky_number = 7;
}
```

Nếu comment có nhiều hơn một dòng,
hãy ngắt nó thành nhiều dòng -.-

```rust
// So we’re doing something complicated here, long enough that we need
// multiple lines of comments to do it! Whew! Hopefully, this comment will
// explain what’s going on.
```

Comment cũng có thể được đặt cuối dòng code, nếu nó ngắn gọn và đơn giản:

```rust
fn main() {
  let lucky_number = 7; // I’m feeling lucky today
}
```

{{#include ./doc-comment.md}}
