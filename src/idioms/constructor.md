# Constructor

Rust không có constructors, thay vào đó có một convention là sử dụng `new` method ([Associated Functions](https://doc.rust-lang.org/stable/book/ch05-03-method-syntax.html#associated-functions)) để tạo một instance mới của struct hoặc enum.

```rust
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn new(x: i32, y: i32) -> Point {
        Point { x, y }
    }
}

fn main() {
    let point = Point::new(1, 2);
    println!("({}, {})", point.x, point.y);
}
```

{{#include ./default-trait.md }}
