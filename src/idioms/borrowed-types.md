# Use borrowed types for arguments

Khi viết functions trong Rust, prefer sử dụng **borrowed types** (&str, &[T], &Path) thay vì **owned types** (String, Vec<T>, PathBuf) cho function parameters. Điều này giúp code linh hoạt hơn và tránh unnecessary clones.

## Vấn đề với Owned Types

```rust
// ❌ Không tốt - chỉ nhận String
fn print_message(message: String) {
    println!("{}", message);
}

fn main() {
    let msg = "Hello";

    // Phải convert từ &str sang String
    print_message(msg.to_string());  // Allocate bộ nhớ không cần thiết

    // Hoặc
    print_message(String::from(msg));
}
```

## Giải pháp: Borrowed Types

```rust
// ✅ Tốt - nhận &str (borrowed)
fn print_message(message: &str) {
    println!("{}", message);
}

fn main() {
    // Có thể truyền &str
    print_message("Hello");

    // Hoặc String (tự động coerce sang &str)
    let owned = String::from("World");
    print_message(&owned);
}
```

## String vs &str

### Owned: String

```rust
// ❌ Hạn chế - chỉ nhận String
fn process(s: String) {
    println!("{}", s.to_uppercase());
}

fn main() {
    let owned = String::from("hello");
    process(owned);  // OK

    // String literal phải convert
    process("world".to_string());  // Phải allocate

    // Không thể dùng owned sau khi pass
    // println!("{}", owned);  // ❌ Error: value moved
}
```

### Borrowed: &str

```rust
// ✅ Linh hoạt - nhận cả &str và &String
fn process(s: &str) {
    println!("{}", s.to_uppercase());
}

fn main() {
    let owned = String::from("hello");
    process(&owned);  // OK, borrow

    // String literal - không cần allocate
    process("world");  // OK, zero-cost

    // Có thể dùng owned sau đó
    println!("{}", owned);  // ✅ OK
}
```

## Vec<T> vs &[T]

### Owned: Vec<T>

```rust
// ❌ Hạn chế - chỉ nhận Vec
fn sum(numbers: Vec<i32>) -> i32 {
    numbers.iter().sum()
}

fn main() {
    let vec = vec![1, 2, 3];
    let total = sum(vec);

    // ❌ Error: vec đã bị moved
    // println!("{:?}", vec);
}
```

### Borrowed: &[T]

```rust
// ✅ Linh hoạt - nhận slice
fn sum(numbers: &[i32]) -> i32 {
    numbers.iter().sum()
}

fn main() {
    // Với Vec
    let vec = vec![1, 2, 3];
    let total = sum(&vec);
    println!("{:?}", vec);  // ✅ OK, vẫn dùng được

    // Với array
    let arr = [4, 5, 6];
    let total2 = sum(&arr);

    // Với slice
    let total3 = sum(&vec[1..]);

    println!("{}, {}, {}", total, total2, total3);
}
```

## PathBuf vs &Path

### Owned: PathBuf

```rust
use std::path::PathBuf;

// ❌ Hạn chế
fn read_config(path: PathBuf) -> std::io::Result<String> {
    std::fs::read_to_string(path)
}

fn main() -> std::io::Result<()> {
    let path = PathBuf::from("config.toml");
    read_config(path)?;

    // ❌ path đã moved, không dùng được nữa
    Ok(())
}
```

### Borrowed: &Path

```rust
use std::path::Path;

// ✅ Linh hoạt
fn read_config(path: &Path) -> std::io::Result<String> {
    std::fs::read_to_string(path)
}

fn main() -> std::io::Result<()> {
    // Với PathBuf
    let path = std::path::PathBuf::from("config.toml");
    read_config(&path)?;

    // Với &str
    read_config(Path::new("config.toml"))?;

    // path vẫn dùng được
    println!("{:?}", path);

    Ok(())
}
```

## Bảng so sánh

| Owned Type | Borrowed Type | Use Case |
|-----------|---------------|----------|
| `String` | `&str` | Text processing, không cần ownership |
| `Vec<T>` | `&[T]` | Read-only access to collection |
| `PathBuf` | `&Path` | File path operations |
| `OsString` | `&OsStr` | OS strings |
| `CString` | `&CStr` | C strings |

## Khi nào dùng Owned Types?

### 1. Function cần ownership

```rust
// ✅ Cần owned để store hoặc modify
fn store_message(message: String) -> Message {
    Message { content: message }  // Move vào struct
}

struct Message {
    content: String,
}
```

### 2. Function modify data

```rust
// ✅ Cần owned để modify
fn uppercase(mut s: String) -> String {
    s.make_ascii_uppercase();
    s
}

fn main() {
    let msg = "hello".to_string();
    let upper = uppercase(msg);
    println!("{}", upper);  // HELLO
}
```

### 3. Builder pattern

```rust
struct Request {
    url: String,
    method: String,
}

impl Request {
    fn new(url: String) -> Self {
        Self {
            url,
            method: "GET".to_string(),
        }
    }

    // Builder methods take ownership
    fn method(mut self, method: String) -> Self {
        self.method = method;
        self
    }
}

fn main() {
    let req = Request::new("https://example.com".to_string())
        .method("POST".to_string());
}
```

## Generic over Borrowed Types

Sử dụng generic bounds để accept cả owned và borrowed:

```rust
use std::borrow::Borrow;

// Accept cả String và &str
fn print<S: AsRef<str>>(s: S) {
    println!("{}", s.as_ref());
}

fn main() {
    print("hello");                    // &str
    print(String::from("world"));      // String
    print(&String::from("rust"));      // &String
}
```

### With collections

```rust
use std::borrow::Borrow;

fn contains<T, Q>(slice: &[T], item: &Q) -> bool
where
    T: Borrow<Q>,
    Q: Eq + ?Sized,
{
    slice.iter().any(|x| x.borrow() == item)
}

fn main() {
    let strings = vec![
        String::from("hello"),
        String::from("world"),
    ];

    // Tìm với &str, không cần String
    println!("{}", contains(&strings, "hello"));  // true
}
```

## Deref Coercion

Rust tự động convert owned → borrowed trong một số cases:

```rust
fn print_str(s: &str) {
    println!("{}", s);
}

fn main() {
    let owned = String::from("hello");

    // Auto deref: &String → &str
    print_str(&owned);

    // Tương đương với:
    // print_str(&*owned);
    // print_str(owned.as_str());
}
```

## Ví dụ thực tế

### File operations

```rust
use std::path::Path;
use std::fs;

// ✅ Linh hoạt với &Path
fn file_exists(path: &Path) -> bool {
    path.exists()
}

fn read_file(path: &Path) -> std::io::Result<String> {
    fs::read_to_string(path)
}

fn main() -> std::io::Result<()> {
    // Nhiều cách gọi
    println!("{}", file_exists(Path::new("config.toml")));

    let path_buf = std::path::PathBuf::from("data.txt");
    println!("{}", file_exists(&path_buf));

    Ok(())
}
```

### API design

```rust
use std::collections::HashMap;

struct UserService {
    users: HashMap<String, User>,
}

struct User {
    name: String,
    email: String,
}

impl UserService {
    // ✅ Borrowed - không cần own the key
    fn get_user(&self, username: &str) -> Option<&User> {
        self.users.get(username)
    }

    // ✅ Owned - cần store the user
    fn add_user(&mut self, username: String, user: User) {
        self.users.insert(username, user);
    }
}

fn main() {
    let mut service = UserService {
        users: HashMap::new(),
    };

    // Add với owned
    service.add_user(
        "alice".to_string(),
        User {
            name: "Alice".to_string(),
            email: "alice@example.com".to_string(),
        },
    );

    // Get với borrowed
    if let Some(user) = service.get_user("alice") {
        println!("{}", user.name);
    }
}
```

## Performance Considerations

### Zero-cost với borrowed types

```rust
// ✅ Zero allocations
fn process(s: &str) {
    for c in s.chars() {
        // Process character
    }
}

fn main() {
    process("hello");  // Không allocate memory
}
```

### Unnecessary allocations với owned

```rust
// ❌ Allocates mỗi lần gọi
fn process(s: String) {
    for c in s.chars() {
        // Process character
    }
}

fn main() {
    process("hello".to_string());  // Allocate memory
}
```

## Best Practices

### 1. Default to borrowed

```rust
// ✅ Bắt đầu với borrowed
fn process(data: &str) { }

// Chỉ dùng owned nếu thực sự cần
fn store(data: String) -> Storage {
    Storage { data }
}
```

### 2. Use AsRef/Borrow traits

```rust
// ✅ Generic over borrowed/owned
fn process<S: AsRef<str>>(s: S) {
    println!("{}", s.as_ref());
}
```

### 3. Document ownership requirements

```rust
/// Process data without taking ownership
fn process(data: &[u8]) { }

/// Takes ownership and stores the data
fn store(data: Vec<u8>) -> DataStore {
    DataStore { data }
}
```

### 4. Consider &mut for in-place modification

```rust
// ✅ Modify in-place
fn uppercase_in_place(s: &mut String) {
    s.make_ascii_uppercase();
}

// ❌ Unnecessary allocation
fn uppercase(s: String) -> String {
    s.to_uppercase()
}
```

## Common Patterns

### Accepting both owned and borrowed

```rust
// Pattern 1: AsRef
fn print1<S: AsRef<str>>(s: S) {
    println!("{}", s.as_ref());
}

// Pattern 2: Into
fn print2(s: impl Into<String>) {
    let s: String = s.into();
    println!("{}", s);
}

// Pattern 3: Borrow
use std::borrow::Borrow;
fn print3<S: Borrow<str>>(s: S) {
    println!("{}", s.borrow());
}
```

## Tổng kết

Use borrowed types for arguments:
- ✅ More flexible (accept owned và borrowed)
- ✅ Better performance (avoid clones)
- ✅ Clearer ownership semantics
- ✅ Idiomatic Rust

Guidelines:
1. **Default to borrowed** (&str, &[T], &Path)
2. **Use owned** khi cần ownership (store, modify, return)
3. **Use AsRef/Borrow** cho flexible APIs
4. **Document** ownership requirements

Common borrowed types:
- `&str` instead of `String`
- `&[T]` instead of `Vec<T>`
- `&Path` instead of `PathBuf`
- `&T` instead of `T` (when possible)

## References

- [Rust API Guidelines - C-BORROWED](https://rust-lang.github.io/api-guidelines/flexibility.html#c-borrowed-type)
- [AsRef and Borrow traits](https://doc.rust-lang.org/std/convert/trait.AsRef.html)
- [Deref coercion](https://doc.rust-lang.org/book/ch15-02-deref.html)
