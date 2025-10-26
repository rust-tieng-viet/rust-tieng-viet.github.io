# Display

Trait [`Display`](https://doc.rust-lang.org/std/fmt/trait.Display.html) cho phép bạn định nghĩa cách một type được hiển thị khi sử dụng format string `{}`. Đây là trait quan trọng để tạo ra output thân thiện với người dùng.

## Display vs Debug

Rust có hai trait chính cho việc formatting:

| Trait | Format Specifier | Mục đích |
|-------|-----------------|----------|
| `Debug` | `{:?}` hoặc `{:#?}` | Development, debugging (technical output) |
| `Display` | `{}` | User-facing output (human-readable) |

```rust
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 3, y: 4 };

    // Debug - technical output
    println!("{:?}", p);  // Point { x: 3, y: 4 }

    // Display - compile error! Display không được derive tự động
    // println!("{}", p);  // ❌ Error: `Point` doesn't implement `Display`
}
```

## Implement Display

Để implement Display, bạn cần định nghĩa method `fmt`:

```rust
use std::fmt;

struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 3, y: 4 };
    println!("{}", p);  // In ra: (3, 4)
}
```

## Ví dụ với Enum

```rust
use std::fmt;

enum Status {
    Active,
    Inactive,
    Pending,
}

impl fmt::Display for Status {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Status::Active => write!(f, "Đang hoạt động"),
            Status::Inactive => write!(f, "Không hoạt động"),
            Status::Pending => write!(f, "Đang chờ xử lý"),
        }
    }
}

fn main() {
    let status = Status::Active;
    println!("Trạng thái: {}", status);  // In ra: Trạng thái: Đang hoạt động
}
```

## Ví dụ với Struct phức tạp

```rust
use std::fmt;

struct Person {
    name: String,
    age: u32,
    email: String,
}

impl fmt::Display for Person {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{} (tuổi {}) - Email: {}",
            self.name, self.age, self.email
        )
    }
}

fn main() {
    let person = Person {
        name: String::from("Nguyễn Văn A"),
        age: 25,
        email: String::from("nguyenvana@example.com"),
    };

    println!("{}", person);
    // In ra: Nguyễn Văn A (tuổi 25) - Email: nguyenvana@example.com
}
```

## Display với nhiều format options

Bạn có thể sử dụng các format options từ `Formatter`:

```rust
use std::fmt;

struct Currency {
    amount: f64,
    symbol: &'static str,
}

impl fmt::Display for Currency {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // Sử dụng precision từ format string
        if let Some(precision) = f.precision() {
            write!(f, "{}{:.precision$}", self.symbol, self.amount, precision = precision)
        } else {
            write!(f, "{}{:.2}", self.symbol, self.amount)
        }
    }
}

fn main() {
    let price = Currency { amount: 1234.5678, symbol: "$" };

    println!("{}", price);       // $1234.57 (mặc định 2 chữ số)
    println!("{:.0}", price);    // $1235 (không có phần thập phân)
    println!("{:.4}", price);    // $1234.5678 (4 chữ số thập phân)
}
```

## Display với Vec và collection

```rust
use std::fmt;

struct NumberList {
    numbers: Vec<i32>,
}

impl fmt::Display for NumberList {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let numbers_str: Vec<String> = self.numbers
            .iter()
            .map(|n| n.to_string())
            .collect();

        write!(f, "[{}]", numbers_str.join(", "))
    }
}

fn main() {
    let list = NumberList {
        numbers: vec![1, 2, 3, 4, 5],
    };

    println!("{}", list);  // In ra: [1, 2, 3, 4, 5]
}
```

## Kết hợp Debug và Display

Thường thì bạn implement cả hai:

```rust
use std::fmt;

#[derive(Debug)]
struct User {
    id: u32,
    username: String,
    is_active: bool,
}

impl fmt::Display for User {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "@{}", self.username)
    }
}

fn main() {
    let user = User {
        id: 1,
        username: String::from("duyet"),
        is_active: true,
    };

    // Display - user-facing
    println!("User: {}", user);
    // In ra: User: @duyet

    // Debug - developer-facing
    println!("Debug: {:?}", user);
    // In ra: Debug: User { id: 1, username: "duyet", is_active: true }
}
```

## Error handling với Display

Display thường được sử dụng khi implement custom error types:

```rust
use std::fmt;
use std::error::Error;

#[derive(Debug)]
enum MyError {
    NotFound(String),
    InvalidInput(String),
    NetworkError,
}

impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            MyError::NotFound(item) => write!(f, "Không tìm thấy: {}", item),
            MyError::InvalidInput(msg) => write!(f, "Dữ liệu không hợp lệ: {}", msg),
            MyError::NetworkError => write!(f, "Lỗi kết nối mạng"),
        }
    }
}

impl Error for MyError {}

fn main() {
    let error = MyError::NotFound(String::from("user.txt"));
    println!("Lỗi: {}", error);
    // In ra: Lỗi: Không tìm thấy: user.txt
}
```

## Display với nested types

```rust
use std::fmt;

struct Address {
    street: String,
    city: String,
}

impl fmt::Display for Address {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}, {}", self.street, self.city)
    }
}

struct Company {
    name: String,
    address: Address,
}

impl fmt::Display for Company {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} tại {}", self.name, self.address)
    }
}

fn main() {
    let company = Company {
        name: String::from("Rust Corp"),
        address: Address {
            street: String::from("123 Nguyễn Huệ"),
            city: String::from("TP.HCM"),
        },
    };

    println!("{}", company);
    // In ra: Rust Corp tại 123 Nguyễn Huệ, TP.HCM
}
```

## So sánh với các ngôn ngữ khác

### Python

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):  # Tương đương Display
        return f"({self.x}, {self.y})"

    def __repr__(self):  # Tương đương Debug
        return f"Point(x={self.x}, y={self.y})"

p = Point(3, 4)
print(p)       # Gọi __str__
print(repr(p)) # Gọi __repr__
```

### Java

```java
class Point {
    private int x, y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public String toString() {  // Tương đương Display
        return String.format("(%d, %d)", x, y);
    }
}

Point p = new Point(3, 4);
System.out.println(p);  // Gọi toString()
```

### Rust - Type Safe

Ưu điểm của Rust:
- Compiler bắt buộc phải implement Display nếu muốn dùng `{}`
- Không thể vô tình in ra kiểu dữ liệu chưa implement Display
- Phân biệt rõ ràng giữa Debug (technical) và Display (user-facing)

## Best Practices

### 1. Display cho user, Debug cho developer

```rust
// ✅ Tốt
impl fmt::Display for User {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.username)  // Simple, user-friendly
    }
}

// ❌ Tránh
impl fmt::Display for User {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "User {{ id: {}, username: {} }}", self.id, self.username)
        // Quá technical, nên dùng Debug
    }
}
```

### 2. Concise và meaningful

```rust
// ✅ Tốt
write!(f, "Error: File not found")

// ❌ Tránh - quá dài dòng
write!(f, "An error has occurred during the file reading operation: The specified file could not be found in the filesystem")
```

### 3. Consistent formatting

```rust
// ✅ Tốt - consistent format cho cùng type
impl fmt::Display for Date {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:04}-{:02}-{:02}", self.year, self.month, self.day)
    }
}
```

## Tổng kết

Display trait là công cụ mạnh mẽ để:
- Tạo output thân thiện với người dùng
- Implement custom formatting cho types
- Tích hợp với error handling
- Cung cấp API nhất quán cho printing

Khi implement Display:
- Giữ output đơn giản, dễ đọc
- Dùng cho user-facing messages
- Kết hợp với Debug cho developer output
- Follow consistent formatting conventions

## References

- [std::fmt::Display](https://doc.rust-lang.org/std/fmt/trait.Display.html)
- [Formatting and Print](https://doc.rust-lang.org/std/fmt/)
- [The Rust Programming Language - Display](https://doc.rust-lang.org/book/ch10-02-traits.html#using-trait-objects-that-allow-for-values-of-different-types)
