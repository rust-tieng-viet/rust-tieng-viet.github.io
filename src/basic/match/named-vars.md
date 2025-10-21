# Matching Named Variables

Named variables trong pattern matching cho phép bạn bind (gán) giá trị vào một biến mới trong match arm. Đây là một tính năng mạnh mẽ giúp bạn trích xuất và sử dụng giá trị từ các kiểu dữ liệu phức tạp.

## Cơ bản về Named Variables

Khi bạn sử dụng một tên biến trong pattern, Rust sẽ tạo một biến mới và gán giá trị match được vào biến đó:

```rust
fn main() {
    let x = 5;

    match x {
        value => println!("Giá trị là: {}", value),
    }
    // In ra: Giá trị là: 5
}
```

Ở ví dụ trên, `value` là một named variable, nó sẽ match với bất kỳ giá trị nào và bind giá trị đó vào biến `value`.

## Shadowing trong Match

Một điểm cần lưu ý là named variable trong match có thể shadow (che khuất) biến bên ngoài:

```rust
fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        Some(50) => println!("Bằng 50"),
        Some(y) => println!("Matched, y = {}", y),  // y ở đây là biến mới!
        _ => println!("Default case, x = {:?}", x),
    }

    println!("Kết thúc: x = {:?}, y = {}", x, y);
}
```

Output:
```
Matched, y = 5
Kết thúc: x = Some(5), y = 10
```

Lưu ý rằng `y` trong pattern `Some(y)` là một biến mới, **không phải** là biến `y = 10` ở ngoài. Biến `y` trong match arm có giá trị là `5` (được extract từ `Some(5)`), còn biến `y` bên ngoài vẫn giữ nguyên giá trị `10`.

## Match với Struct

Named variables rất hữu ích khi destructure struct:

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let point = Point { x: 0, y: 7 };

    match point {
        Point { x, y: 0 } => println!("Trên trục x tại x = {}", x),
        Point { x: 0, y } => println!("Trên trục y tại y = {}", y),
        Point { x, y } => println!("Tại ({}, {})", x, y),
    }
    // In ra: Trên trục y tại y = 7
}
```

Bạn có thể đặt tên khác cho biến:

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let point = Point { x: 5, y: 10 };

    match point {
        Point { x: horizontal, y: vertical } => {
            println!("Tọa độ ngang: {}, tọa độ dọc: {}", horizontal, vertical);
        }
    }
    // In ra: Tọa độ ngang: 5, tọa độ dọc: 10
}
```

## Match với Enum

Named variables cho phép extract giá trị từ enum variants:

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn process_message(msg: Message) {
    match msg {
        Message::Quit => println!("Thoát"),
        Message::Move { x, y } => println!("Di chuyển đến ({}, {})", x, y),
        Message::Write(text) => println!("Văn bản: {}", text),
        Message::ChangeColor(r, g, b) => println!("Đổi màu RGB({}, {}, {})", r, g, b),
    }
}

fn main() {
    let msg1 = Message::Move { x: 10, y: 20 };
    let msg2 = Message::Write(String::from("Hello"));
    let msg3 = Message::ChangeColor(255, 0, 0);

    process_message(msg1);  // In ra: Di chuyển đến (10, 20)
    process_message(msg2);  // In ra: Văn bản: Hello
    process_message(msg3);  // In ra: Đổi màu RGB(255, 0, 0)
}
```

## Match với Tuple

```rust
fn main() {
    let tuple = (1, 2, 3);

    match tuple {
        (0, y, z) => println!("Phần tử đầu là 0, y = {}, z = {}", y, z),
        (x, 0, z) => println!("Phần tử giữa là 0, x = {}, z = {}", x, z),
        (x, y, 0) => println!("Phần tử cuối là 0, x = {}, y = {}", x, y),
        (x, y, z) => println!("x = {}, y = {}, z = {}", x, y, z),
    }
    // In ra: x = 1, y = 2, z = 3
}
```

## Sử dụng `@` binding

`@` operator cho phép bạn vừa test một giá trị với pattern, vừa bind giá trị đó vào một biến:

```rust
fn main() {
    let age = 25;

    match age {
        n @ 0..=12 => println!("Trẻ em, tuổi: {}", n),
        n @ 13..=19 => println!("Thiếu niên, tuổi: {}", n),
        n @ 20..=64 => println!("Người trưởng thành, tuổi: {}", n),
        n @ 65.. => println!("Người cao tuổi, tuổi: {}", n),
    }
    // In ra: Người trưởng thành, tuổi: 25
}
```

Không có `@`, bạn sẽ không có biến để sử dụng:

```rust
match age {
    0..=12 => println!("Trẻ em"),  // không biết tuổi cụ thể
    // ...
}
```

## `@` với enum

`@` binding rất hữu ích khi làm việc với enum:

```rust
enum Message {
    Hello { id: i32 },
}

fn main() {
    let msg = Message::Hello { id: 5 };

    match msg {
        Message::Hello { id: id_var @ 3..=7 } => {
            println!("ID trong khoảng 3-7: {}", id_var);
        }
        Message::Hello { id: 10..=12 } => {
            println!("ID trong khoảng 10-12");
        }
        Message::Hello { id } => {
            println!("ID khác: {}", id);
        }
    }
    // In ra: ID trong khoảng 3-7: 5
}
```

## Phân biệt với `_`

Named variable sẽ match và bind giá trị, trong khi `_` chỉ match mà không bind:

```rust
fn main() {
    let x = 5;

    match x {
        value => println!("Có giá trị: {}", value),  // OK, có thể dùng value
    }

    match x {
        _ => println!("Có giá trị: {}", x),  // Dùng x từ outer scope
    }
}
```

Sử dụng `_` khi bạn không quan tâm đến giá trị:

```rust
struct Point {
    x: i32,
    y: i32,
    z: i32,
}

fn main() {
    let point = Point { x: 0, y: 0, z: 8 };

    match point {
        Point { x: 0, y: 0, z } => println!("Trên trục z tại z = {}", z),
        Point { x: 0, y, z: _ } => println!("Trên mặt phẳng yz, y = {}", y),
        Point { x, y: _, z: _ } => println!("x = {}, không quan tâm y và z", x),
        _ => println!("Điểm khác"),
    }
}
```

## Ví dụ thực tế: Parse kết quả

```rust
fn parse_config(input: &str) -> Result<(String, u16), String> {
    let parts: Vec<&str> = input.split(':').collect();

    match parts.as_slice() {
        [host, port] => {
            match port.parse::<u16>() {
                Ok(port_num) => Ok((host.to_string(), port_num)),
                Err(_) => Err("Port không hợp lệ".to_string()),
            }
        }
        _ => Err("Format không đúng".to_string()),
    }
}

fn main() {
    match parse_config("localhost:8080") {
        Ok((host, port)) => println!("Server: {} trên port {}", host, port),
        Err(e) => println!("Lỗi: {}", e),
    }
    // In ra: Server: localhost trên port 8080
}
```

## References

- [Destructuring to Break Apart Values](https://doc.rust-lang.org/book/ch18-03-pattern-syntax.html#destructuring-to-break-apart-values)
- [@ Bindings](https://doc.rust-lang.org/book/ch18-03-pattern-syntax.html#-bindings)
- [Patterns and Matching](https://doc.rust-lang.org/book/ch18-00-patterns.html)
