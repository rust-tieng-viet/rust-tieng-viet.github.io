# Xung đột biến môi trường

Các unit tests trong cùng một module được thực thi song song nhau, trong cùng một process. 
Một trường hợp mà mình đã gặp phải là xung đột do 2 tests cùng sử dụng một biến môi trường
hoặc biến môi trường ảnh hưởng đến kết quả của tests khác.

```rust
use std::env;

#[test]
fn test_one() {
  env::set_var("KEY", "value_one");
  assert_eq!(env::var("KEY"), Ok("value_one".to_string()));
}

#[test]
fn test_one() {
  env::set_var("KEY", "value_two");
  assert_eq!(env::var("KEY"), Ok("value_two".to_string()));
}
```

Giải pháp ổn nhất hiện tại mình dùng để giải quyết là
[`serial_test`](https://docs.rs/serial_test/latest/serial_test/)

File: Cargo.toml

```toml
[dev-dependencies]
serial_test = "0.9"
```

```rust
use std::env;

#[test]
#[serial]
fn test_one() {
  env::set_var("KEY", "value_one");
  assert_eq!(env::var("KEY"), Ok("value_one".to_string()));
}

#[test]
#[serial]
fn test_one() {
  env::set_var("KEY", "value_two");
  assert_eq!(env::var("KEY"), Ok("value_two".to_string()));
}
```

Các tests có `#[serial]` sẽ được thực hiện tuần tự nhau, tránh trường hợp xung đột như trước.

## References

- <https://crates.io/crates/serial_test>
- <https://docs.rs/serial_test>
