# Khác nhau giữa Macros và Functions

```rust
// Macros

macro_rules! print_message {
    (msg: $msg:expr) => {
        println!("Message: {}", $msg);
    };
}

fn main() {
    print_message!(msg: "Hello, world!");
}
```

```rust
/// Functions
fn print_message(msg: &str) {
    println!("Message: {}", msg);
}

fn main() {
    print_message("Hello, world!");
}
```

## Điểm khác biệt trong thời điểm biên dịch

- Functions được thực thi trong quá trình thực thi của chương trình, còn Macros được đánh giá và mở rộng trong quá trình biên dịch.
- Functions chỉ có thể được gọi khi chương trình đang chạy, trong khi Macros có thể được gọi bất kỳ lúc nào trong quá trình biên dịch.

## AST (Abstract Syntax Tree)

- Macros có thể truy cập vào AST của code được viết, cho phép thay đổi code theo cách động.
- Functions không có quyền truy cập vào AST của code được viết.

## Input / Output

|        | **Rust Macros**           | **Rust Functions**                   |
|--------|---------------------------|--------------------------------------|
| Input  | Token stream              | Tham số và đối số của hàm            |
| Output | Đoạn mã Rust được mở rộng | Giá trị hoặc hiệu ứng sẽ được trả về |

```rust
macro_rules! math {
    ($x:expr + $y:expr) => { $x * $y };
}

fn main() {
    let result = math!(4 + 5);
    println!("4 * 5 = {}", result);
}
```

Khi biên dịch, macro `math!` sẽ được mở rộng và tạo ra đoạn mã `4 * 5` được tính toán thành `20`.
Tham số của macro lúc này là `$x:expr + $y:expr` là [token stream](https://doc.rust-lang.org/reference/macros-by-example.html), cho phép khả năng mở rộng cú pháp không giới hạn.


## Sử dụng và ứng dụng

- Functions được sử dụng để đóng gói một khối lệnh nhất định, giúp tái sử dụng và quản lý code dễ dàng hơn.
- Macros được sử dụng để thay đổi code tại thời điểm biên dịch, giúp viết code ngắn gọn và hiệu quả hơn.
