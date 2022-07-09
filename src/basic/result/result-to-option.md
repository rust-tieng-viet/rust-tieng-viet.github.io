# Convert `Result` sang `Option`

Đôi khi bạn sẽ cần convert từ 
- `Ok(v)` sang `Some(v)`, hoặc
- `Err(e)` sang `Some(e)`

## `.ok()`

```rust
// .ok(v) = Some(v)
let x: Result<u32, &str> = Ok(2);
assert_eq!(x.ok(), Some(2));

let x: Result<u32, &str> = Err("Nothing here");
assert_eq!(x.ok(), None);
```

## `.err()`

```rust
// .err()
let x: Result<u32, &str> = Ok(2);
assert_eq!(x.err(), None);

let x: Result<u32, &str> = Err("Nothing here");
assert_eq!(x.err(), Some("Nothing here"));
```