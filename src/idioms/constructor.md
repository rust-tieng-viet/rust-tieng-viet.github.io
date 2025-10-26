# Constructor

Rust không có constructors như các ngôn ngữ hướng đối tượng khác (Java, C++, etc.). Thay vào đó, Rust sử dụng convention là tạo [Associated Functions](https://doc.rust-lang.org/stable/book/ch05-03-method-syntax.html#associated-functions) có tên `new` để khởi tạo instance mới.

## Convention cơ bản: `new()`

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

## Tại sao không dùng `pub` cho fields?

Trong thực tế, chúng ta thường giữ các fields là private và cung cấp constructor `new()` để kiểm soát việc khởi tạo:

```rust
pub struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // Constructor đảm bảo width và height hợp lệ
    pub fn new(width: u32, height: u32) -> Result<Self, String> {
        if width == 0 || height == 0 {
            return Err("Width and height must be positive".to_string());
        }
        Ok(Rectangle { width, height })
    }

    pub fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect = Rectangle::new(10, 20).unwrap();
    println!("Area: {}", rect.area());

    // Lỗi compile: fields are private
    // println!("{}", rect.width);
}
```

## Multiple Constructors

Rust cho phép tạo nhiều constructor methods với tên khác nhau:

```rust
pub struct Color {
    r: u8,
    g: u8,
    b: u8,
}

impl Color {
    pub fn new(r: u8, g: u8, b: u8) -> Self {
        Color { r, g, b }
    }

    pub fn from_hex(hex: u32) -> Self {
        Color {
            r: ((hex >> 16) & 0xFF) as u8,
            g: ((hex >> 8) & 0xFF) as u8,
            b: (hex & 0xFF) as u8,
        }
    }

    pub fn black() -> Self {
        Color { r: 0, g: 0, b: 0 }
    }

    pub fn white() -> Self {
        Color { r: 255, g: 255, b: 255 }
    }
}

fn main() {
    let c1 = Color::new(255, 0, 0);          // Red
    let c2 = Color::from_hex(0x00FF00);      // Green
    let c3 = Color::black();                  // Black
    let c4 = Color::white();                  // White
}
```

## Builder Pattern cho complex constructors

Khi struct có nhiều parameters, nên sử dụng Builder Pattern:

```rust
pub struct User {
    username: String,
    email: String,
    age: Option<u32>,
    country: Option<String>,
}

pub struct UserBuilder {
    username: String,
    email: String,
    age: Option<u32>,
    country: Option<String>,
}

impl User {
    pub fn builder(username: String, email: String) -> UserBuilder {
        UserBuilder {
            username,
            email,
            age: None,
            country: None,
        }
    }
}

impl UserBuilder {
    pub fn age(mut self, age: u32) -> Self {
        self.age = Some(age);
        self
    }

    pub fn country(mut self, country: String) -> Self {
        self.country = Some(country);
        self
    }

    pub fn build(self) -> User {
        User {
            username: self.username,
            email: self.email,
            age: self.age,
            country: self.country,
        }
    }
}

fn main() {
    let user = User::builder(
        "duyet".to_string(),
        "duyet@example.com".to_string()
    )
    .age(25)
    .country("Vietnam".to_string())
    .build();
}
```

## Constructor với validation

```rust
pub struct Email {
    address: String,
}

impl Email {
    pub fn new(address: String) -> Result<Self, &'static str> {
        if !address.contains('@') {
            return Err("Invalid email address");
        }
        Ok(Email { address })
    }

    pub fn as_str(&self) -> &str {
        &self.address
    }
}

fn main() {
    match Email::new("user@example.com".to_string()) {
        Ok(email) => println!("Valid email: {}", email.as_str()),
        Err(e) => println!("Error: {}", e),
    }
}
```

## Khi nào dùng `new()` vs `default()`?

- **`new()`**: Khi cần parameters để khởi tạo
- **`default()`**: Khi có thể tạo instance với giá trị mặc định hợp lý

Thông thường, struct sẽ implement cả hai:

```rust
#[derive(Debug)]
pub struct Config {
    pub host: String,
    pub port: u16,
}

impl Config {
    pub fn new(host: String, port: u16) -> Self {
        Config { host, port }
    }
}

impl Default for Config {
    fn default() -> Self {
        Config {
            host: "localhost".to_string(),
            port: 8080,
        }
    }
}

fn main() {
    let config1 = Config::new("example.com".to_string(), 3000);
    let config2 = Config::default();

    println!("{:?}", config1);
    println!("{:?}", config2);
}
```

{{#include ./default-trait.md }}
