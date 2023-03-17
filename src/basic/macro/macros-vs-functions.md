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

## Sử dụng và ứng dụng

- Functions được sử dụng để đóng gói một khối lệnh nhất định, giúp tái sử dụng và quản lý code dễ dàng hơn.
- Macros được sử dụng để thay đổi code tại thời điểm biên dịch, giúp viết code ngắn gọn và hiệu quả hơn.
