# Convert `Result` -> `Option`

Đôi khi bạn sẽ cần convert từ:

- `Ok(v)` --> `Some(v)`
- hoặc ngược lại, `Err(e)` --> `Some(e)`

## `.ok()`

```rust,editable
// .ok(v) = Some(v)
let x: Result<u32, &str> = Ok(2);
assert_eq!(x.ok(), Some(2));

let y: Result<u32, &str> = Err("Nothing here");
assert_eq!(y.ok(), None);
```

## `.err()`

```rust,editable
// .err()
let x: Result<u32, &str> = Ok(2);
assert_eq!(x.err(), None);

let x: Result<u32, &str> = Err("Nothing here");
assert_eq!(x.err(), Some("Nothing here"));
```