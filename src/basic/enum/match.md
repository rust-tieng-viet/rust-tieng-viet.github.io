# match Enum

`match` cực kỳ mạnh và được dùng trong Rust phổ biến.

Ví dụ sau là cách để kiểm tra một giá trị enum là variant nào.

```rust,editable
enum Coin {
  Penny,
  Nickel,
  Dime,
  Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
  match coin {
    Coin::Penny => 1,
    Coin::Nickel => 5,
    Coin::Dime => 10,
    Coin::Quarter => 25,
  }
}

fn main() {}
```

`match` còn có thể trích xuất các giá trị từ tuple variant hoặc struct variant.

```rust
enum FlashMessage {
  Success, // unit variant
  Error(String), // tuple variant
  Warning { category: i32, message: String }, // struct variant
}

fn format_message(message: FlashMessage) -> String {
  match message {
    FlashMessage::Success => "success".to_string(),
    FlashMessage::Error(err) => format!("My error: {}", err),
    FlashMessage::Warning{ category, message } => format!("Warn: {} (category: {})", message, category),
  }
}

let m = format_message(FlashMessage::Error("something went wrong".to_string()));
println!("{m}");
```

## References

- <https://doc.rust-lang.org/book/ch06-02-match.html>
- <https://blog.logrocket.com/rust-enums-and-pattern-matching/>
