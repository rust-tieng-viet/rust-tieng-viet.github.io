## Unit Tests

Unit tests được đặt trong thư mục `src` trong mỗi file code mà bạn đang test.
Có một convention là tạo một module tên `tests` trong mỗi file chứa function cần test,
annotate module này với attribute `#[cfg(test)]`.

### `#[cfg(test)]`

`#[cfg(test)]` báo cho compiler biết module này được dùng để compile thành test, chỉ được dùng 
khi chạy `cargo test`, không dùng khi `cargo build`.

File: src/lib.rs

```rust
pub fn adder(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_adder() {
    let expected = 4;
    let actual = adder(2, 2);

    assert_eq!(expected, actual);
  }
}
```

Trong module `tests` có thể sẽ có một vài helper function khác, do đó những function nào
là function test sẽ được đánh dấu là `#[test]` để compiler nhận biết.

### Test private function

Ở ví dụ trên thì public function `adder` được import vào trong module `tests` theo đúng rule của Rust.
Vậy còn private function thì sao? Có một cuộc tranh cãi trong cộng đồng về việc này.
Cuối cùng thì Rust cho phép import private function vào `tests` module.

```rust
pub fn adder(a: i32, b: i32) -> i32 {
    adder_internal(a, b)
}

fn adder_internal(a: i32, b: i32) -> i32 {
    a + b
}
 
#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_adder() {
    let expected = 4;
    let actual = adder_internal(2, 2);

    assert_eq!(expected, actual);
  }
}
```
