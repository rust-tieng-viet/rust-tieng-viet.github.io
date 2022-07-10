# Enum

Giống như các ngôn ngữ khác, Enum là một kiểu giá trị đơn, chứa các biến thể (variants).

```rust
enum Day {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

let today = Day::Sunday;
```

Enum variant có thể là

- unit variant
- tuple variant
- struct variant


```rust
enum FlashMessage {
  Success, // unit variant
  Error(String), // tuple variant
  Warning { category: i32, message: String }, // struct variant
}
```

{{#include ./match.md}}
{{#include ./use-variants.md}}
{{#include ./impl.md}}
