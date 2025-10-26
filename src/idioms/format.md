# Concatenating strings with `format!`

Trong Rust, khi cần nối các chuỗi với nhau, sử dụng macro `format!` là một idiom phổ biến và hiệu quả.

## Tại sao nên dùng `format!`?

`format!` macro tạo ra một `String` mới bằng cách kết hợp các giá trị theo một template định sẵn. Điều này giúp code dễ đọc và bảo trì hơn so với việc nối chuỗi thủ công.

## Ví dụ cơ bản

```rust
let name = "Duyet";
let age = 18;
let message = format!("{} is {} years old", name, age);
println!("{}", message);
// Output: Duyet is 18 years old
```

## Các cách sử dụng khác

### Named parameters

```rust
let message = format!("{name} is {age} years old", name = "Duyet", age = 18);
println!("{}", message);
// Output: Duyet is 18 years old
```

### Formatting numbers

```rust
let pi = 3.14159265359;
let formatted = format!("Pi rounded to 2 decimals: {:.2}", pi);
println!("{}", formatted);
// Output: Pi rounded to 2 decimals: 3.14

let hex = format!("Hex: 0x{:X}", 255);
println!("{}", hex);
// Output: Hex: 0xFF
```

### Debug formatting

```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

let point = Point { x: 10, y: 20 };
let debug_output = format!("Point: {:?}", point);
println!("{}", debug_output);
// Output: Point: Point { x: 10, y: 20 }

let pretty_output = format!("Point:\n{:#?}", point);
println!("{}", pretty_output);
// Output (pretty-printed):
// Point:
// Point {
//     x: 10,
//     y: 20,
// }
```

### Padding và Alignment

```rust
// Padding với spaces
let padded = format!("{:>10}", "Rust");
println!("'{}'", padded);
// Output: '      Rust'

// Padding bên trái
let left_padded = format!("{:<10}", "Rust");
println!("'{}'", left_padded);
// Output: 'Rust      '

// Center alignment
let centered = format!("{:^10}", "Rust");
println!("'{}'", centered);
// Output: '   Rust   '

// Padding với custom character
let custom = format!("{:*>10}", "Rust");
println!("{}", custom);
// Output: ******Rust
```

## So sánh với các cách khác

### ❌ Không nên: Sử dụng `+` operator

```rust
let name = "Duyet".to_string();
let age = 18;
// Phức tạp và khó đọc
let message = name + " is " + &age.to_string() + " years old";
```

### ❌ Không nên: Sử dụng `push_str` nhiều lần

```rust
let mut message = String::new();
message.push_str("Duyet");
message.push_str(" is ");
message.push_str(&18.to_string());
message.push_str(" years old");
// Dài dòng và khó maintain
```

### ✅ Nên: Sử dụng `format!`

```rust
let message = format!("{} is {} years old", "Duyet", 18);
// Ngắn gọn, dễ đọc, dễ maintain
```

## Hiệu năng

Lưu ý rằng `format!` sẽ allocate memory mới cho `String` kết quả. Nếu bạn đang trong một vòng lặp hiệu năng cao và cần tối ưu, có thể cân nhắc sử dụng `write!` macro để ghi trực tiếp vào một buffer có sẵn:

```rust
use std::fmt::Write;

let mut output = String::new();
write!(&mut output, "{} is {} years old", "Duyet", 18).unwrap();
```

## Tham khảo

- [std::fmt documentation](https://doc.rust-lang.org/std/fmt/)
- [format! macro](https://doc.rust-lang.org/std/macro.format.html)