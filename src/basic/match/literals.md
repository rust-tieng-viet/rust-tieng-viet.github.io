# Matching giá trị

Pattern matching với literals (giá trị cụ thể) là cách sử dụng phổ biến nhất của `match` trong Rust. Bạn có thể match trực tiếp với các giá trị cụ thể như số, ký tự, hay chuỗi.

## Match với số nguyên

```rust
fn describe_number(x: i32) {
    match x {
        1 => println!("Một"),
        2 => println!("Hai"),
        3 => println!("Ba"),
        _ => println!("Số khác"),
    }
}

fn main() {
    describe_number(1);  // In ra: Một
    describe_number(5);  // In ra: Số khác
}
```

Pattern `_` (underscore) là một wildcard pattern, match với mọi giá trị còn lại. Nó giống như `default` case trong `switch` của C/Java.

## Match với ký tự

```rust
fn describe_char(c: char) {
    match c {
        'a' => println!("Chữ a"),
        'b' => println!("Chữ b"),
        '0'..='9' => println!("Một chữ số"),
        _ => println!("Ký tự khác"),
    }
}

fn main() {
    describe_char('a');  // In ra: Chữ a
    describe_char('5');  // In ra: Một chữ số
    describe_char('z');  // In ra: Ký tự khác
}
```

Ở ví dụ trên, `'0'..='9'` là range pattern, match với mọi ký tự từ '0' đến '9'.

## Match với boolean

```rust
fn is_true(b: bool) -> &'static str {
    match b {
        true => "Đúng rồi!",
        false => "Sai rồi!",
    }
}

fn main() {
    println!("{}", is_true(true));   // In ra: Đúng rồi!
    println!("{}", is_true(false));  // In ra: Sai rồi!
}
```

Với boolean, bạn không cần dùng `_` vì chỉ có 2 giá trị: `true` và `false`.

## Match với range

```rust
fn categorize_age(age: u32) {
    match age {
        0 => println!("Trẻ sơ sinh"),
        1..=12 => println!("Trẻ em"),
        13..=19 => println!("Thiếu niên"),
        20..=64 => println!("Người trưởng thành"),
        65..=u32::MAX => println!("Người cao tuổi"),
    }
}

fn main() {
    categorize_age(5);   // In ra: Trẻ em
    categorize_age(25);  // In ra: Người trưởng thành
    categorize_age(70);  // In ra: Người cao tuổi
}
```

Cú pháp `1..=12` là inclusive range (bao gồm cả 1 và 12). Nếu dùng `1..12` thì sẽ là exclusive range (từ 1 đến 11, không bao gồm 12).

## Exhaustiveness Checking

Một điểm mạnh của `match` trong Rust là compiler sẽ kiểm tra xem bạn đã xử lý hết tất cả các trường hợp chưa. Điều này giúp tránh bugs.

```rust
fn check_number(x: i32) {
    match x {
        1 => println!("Một"),
        2 => println!("Hai"),
        // ❌ Compiler sẽ báo lỗi: pattern `i32::MIN..=0_i32` and `3_i32..=i32::MAX` not covered
    }
}
```

Bạn phải xử lý tất cả các trường hợp, hoặc sử dụng `_` để bắt các trường hợp còn lại:

```rust
fn check_number(x: i32) {
    match x {
        1 => println!("Một"),
        2 => println!("Hai"),
        _ => println!("Số khác"),  // ✅ OK
    }
}
```

## So sánh với `if-else`

Trong một số ngôn ngữ khác như JavaScript hay Python, bạn có thể dùng `if-else` để làm việc tương tự:

```javascript
// JavaScript
function describeNumber(x) {
  if (x === 1) {
    console.log("Một");
  } else if (x === 2) {
    console.log("Hai");
  } else if (x === 3) {
    console.log("Ba");
  } else {
    console.log("Số khác");
  }
}
```

Tuy nhiên `match` trong Rust có nhiều ưu điểm hơn:
- Compiler kiểm tra exhaustiveness (đã xử lý hết tất cả trường hợp chưa)
- Dễ đọc và rõ ràng hơn với nhiều trường hợp
- Có thể match với pattern phức tạp (struct, enum, ...)

## Trả về giá trị

`match` là một expression, có nghĩa là nó có thể trả về giá trị:

```rust
fn number_to_string(x: i32) -> String {
    match x {
        1 => "một".to_string(),
        2 => "hai".to_string(),
        3 => "ba".to_string(),
        _ => format!("số {}", x),
    }
}

fn main() {
    let result = number_to_string(2);
    println!("{}", result);  // In ra: hai
}
```

Tất cả các arm (nhánh) của `match` phải trả về cùng một kiểu dữ liệu.

## References

- [Match - The Rust Programming Language](https://doc.rust-lang.org/book/ch06-02-match.html)
- [Patterns and Matching](https://doc.rust-lang.org/book/ch18-00-patterns.html)
