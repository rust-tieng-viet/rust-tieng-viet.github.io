# Privacy for Extensibility

Một trong những idioms quan trọng nhất trong Rust API design là sử dụng privacy (tính riêng tư) để đảm bảo API có thể được mở rộng trong tương lai mà không breaking changes.

## Nguyên tắc cơ bản

**Mặc định, hãy giữ mọi thứ private, chỉ expose những gì cần thiết.**

Điều này cho phép bạn thay đổi implementation details trong tương lai mà không ảnh hưởng đến users của library.

## Ví dụ: Struct Fields

### ❌ Không nên: Public fields

```rust
pub struct User {
    pub username: String,
    pub email: String,
    pub age: u32,
}

fn main() {
    let user = User {
        username: "duyet".to_string(),
        email: "duyet@example.com".to_string(),
        age: 25,
    };

    // Users có thể truy cập và modify trực tiếp
    println!("{}", user.age);
}
```

**Vấn đề:**
- Không thể thêm validation
- Không thể track changes
- Không thể thay đổi internal representation
- Breaking change nếu rename hoặc xóa field

### ✅ Nên: Private fields với accessor methods

```rust
pub struct User {
    username: String,
    email: String,
    age: u32,
}

impl User {
    pub fn new(username: String, email: String, age: u32) -> Result<Self, String> {
        if age > 150 {
            return Err("Invalid age".to_string());
        }
        if !email.contains('@') {
            return Err("Invalid email".to_string());
        }

        Ok(User { username, email, age })
    }

    pub fn username(&self) -> &str {
        &self.username
    }

    pub fn email(&self) -> &str {
        &self.email
    }

    pub fn age(&self) -> u32 {
        self.age
    }

    pub fn set_email(&mut self, email: String) -> Result<(), String> {
        if !email.contains('@') {
            return Err("Invalid email".to_string());
        }
        self.email = email;
        Ok(())
    }
}

fn main() {
    let user = User::new(
        "duyet".to_string(),
        "duyet@example.com".to_string(),
        25,
    ).unwrap();

    println!("{}", user.age());
}
```

**Ưu điểm:**
- Có thể thêm validation logic
- Có thể thay đổi internal representation
- Có thể track changes, logging
- API ổn định hơn

## Non-exhaustive Enums

Sử dụng `#[non_exhaustive]` để cho phép thêm variants trong tương lai:

```rust
#[non_exhaustive]
pub enum Error {
    NotFound,
    PermissionDenied,
    Timeout,
}

// Trong tương lai có thể thêm:
// NetworkError,
// DatabaseError,
// ...mà không breaking existing code
```

Users buộc phải có default case khi match:

```rust
fn handle_error(error: Error) {
    match error {
        Error::NotFound => println!("Not found"),
        Error::PermissionDenied => println!("Permission denied"),
        Error::Timeout => println!("Timeout"),
        // Bắt buộc phải có _ case
        _ => println!("Other error"),
    }
}
```

## Non-exhaustive Structs

Tương tự với structs, `#[non_exhaustive]` prevent users khởi tạo trực tiếp:

```rust
#[non_exhaustive]
pub struct Config {
    pub host: String,
    pub port: u16,
}

impl Config {
    pub fn new(host: String, port: u16) -> Self {
        Config { host, port }
    }
}
```

Users không thể sử dụng struct literal syntax:

```rust
// ❌ Compile error!
// let config = Config {
//     host: "localhost".to_string(),
//     port: 8080,
// };

// ✅ Must use constructor
let config = Config::new("localhost".to_string(), 8080);
```

## Builder Pattern cho Extensibility

Builder pattern giúp thêm fields mới mà không breaking changes:

```rust
pub struct HttpClient {
    timeout: u64,
    retry_count: u32,
    user_agent: String,
}

pub struct HttpClientBuilder {
    timeout: u64,
    retry_count: u32,
    user_agent: String,
}

impl HttpClient {
    pub fn builder() -> HttpClientBuilder {
        HttpClientBuilder {
            timeout: 30,
            retry_count: 3,
            user_agent: "MyClient/1.0".to_string(),
        }
    }
}

impl HttpClientBuilder {
    pub fn timeout(mut self, timeout: u64) -> Self {
        self.timeout = timeout;
        self
    }

    pub fn retry_count(mut self, count: u32) -> Self {
        self.retry_count = count;
        self
    }

    pub fn user_agent(mut self, agent: String) -> Self {
        self.user_agent = agent;
        self
    }

    pub fn build(self) -> HttpClient {
        HttpClient {
            timeout: self.timeout,
            retry_count: self.retry_count,
            user_agent: self.user_agent,
        }
    }
}

fn main() {
    let client = HttpClient::builder()
        .timeout(60)
        .retry_count(5)
        .build();
}
```

Trong tương lai có thể thêm field mới:

```rust
pub struct HttpClientBuilder {
    timeout: u64,
    retry_count: u32,
    user_agent: String,
    // Thêm mới - không breaking change!
    max_redirects: u32,
}

impl HttpClientBuilder {
    // Thêm method mới
    pub fn max_redirects(mut self, max: u32) -> Self {
        self.max_redirects = max;
        self
    }
}

// Existing code vẫn hoạt động bình thường!
let client = HttpClient::builder()
    .timeout(60)
    .build();
```

## Private modules

Sử dụng private modules để ẩn implementation details:

```rust
// lib.rs
mod internal {
    // Private helper functions
    pub(crate) fn helper() {
        // ...
    }
}

pub mod api {
    // Public API
    pub fn public_function() {
        crate::internal::helper();
    }
}
```

## Sealed Trait Pattern

Prevent users implement trait của bạn:

```rust
mod sealed {
    pub trait Sealed {}
}

pub trait MyTrait: sealed::Sealed {
    fn do_something(&self);
}

// Chỉ types trong module này có thể implement MyTrait
impl sealed::Sealed for MyType {}
impl MyTrait for MyType {
    fn do_something(&self) {
        // ...
    }
}

// Users không thể implement MyTrait cho types của họ
// vì không thể access sealed::Sealed
```

## Visibility Modifiers

Rust cung cấp nhiều levels của visibility:

```rust
pub struct Container {
    pub public_field: i32,           // Accessible everywhere
    pub(crate) crate_field: i32,     // Accessible within crate
    pub(super) parent_field: i32,    // Accessible in parent module
    private_field: i32,               // Accessible in same module
}
```

## Real-world Example: Database Client

```rust
pub struct Database {
    // Private: có thể thay đổi từ String sang URL type
    connection_string: String,
    // Private: có thể switch sang connection pool
    max_connections: u32,
}

impl Database {
    pub fn connect(url: &str) -> Result<Self, String> {
        // Validation
        if url.is_empty() {
            return Err("Empty URL".to_string());
        }

        Ok(Database {
            connection_string: url.to_string(),
            max_connections: 10,
        })
    }

    pub fn with_max_connections(url: &str, max: u32) -> Result<Self, String> {
        let mut db = Self::connect(url)?;
        db.max_connections = max;
        Ok(db)
    }

    pub fn execute(&self, query: &str) -> Result<Vec<String>, String> {
        // Implementation có thể thay đổi hoàn toàn
        println!("Executing: {}", query);
        Ok(vec![])
    }
}
```

Trong tương lai có thể thay đổi implementation:

```rust
use std::sync::Arc;

pub struct Database {
    // Thay đổi internal structure
    connection_pool: Arc<ConnectionPool>,
    config: DatabaseConfig,
}

// Public API không thay đổi!
impl Database {
    pub fn connect(url: &str) -> Result<Self, String> {
        // New implementation
        // ...
    }

    pub fn execute(&self, query: &str) -> Result<Vec<String>, String> {
        // New implementation using pool
        // ...
    }
}
```

## Best Practices

1. **Start private**: Mặc định mọi thứ private, expose dần khi cần
2. **Use `#[non_exhaustive]`**: Cho enums và structs có thể mở rộng
3. **Prefer methods over public fields**: Giữ control và flexibility
4. **Document stability**: Ghi rõ API nào stable, nào experimental
5. **Use semantic versioning**: Breaking changes = major version bump

## Anti-patterns

❌ **Tránh expose internal types:**

```rust
// ❌ Bad
pub use internal::InternalType;

pub fn process() -> InternalType {
    // ...
}
```

✅ **Wrap hoặc convert:**

```rust
// ✅ Good
pub struct PublicType {
    // ...
}

pub fn process() -> PublicType {
    let internal = internal::InternalType::new();
    PublicType::from(internal)
}
```

## Tham khảo

- [Rust API Guidelines - Future proofing](https://rust-lang.github.io/api-guidelines/future-proofing.html)
- [The Rust Reference - Visibility](https://doc.rust-lang.org/reference/visibility-and-privacy.html)
- [Sealed Trait Pattern](https://rust-lang.github.io/api-guidelines/future-proofing.html#sealed-traits-protect-against-downstream-implementations-c-sealed)
