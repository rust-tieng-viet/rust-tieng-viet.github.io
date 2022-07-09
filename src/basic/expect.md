### `.expect()`

Giống `.unwrap()`, nhưng khi panic thì Rust sẽ kèm theo message

```rust
let x: Option<&str> = None;
x.expect("fruits are healthy"); // panics: `fruits are healthy`
```