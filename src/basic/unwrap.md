### `.unwrap()`

Trả về giá trị nằm trong `Some(T)`. Nếu giá trị là `None` thì panic chương trình. 

```rust
let x = Some("air");
assert_eq!(x.unwrap(), "air");

let x: Option<&str> = None;
assert_eq!(x.unwrap(), "air"); // panic!
```