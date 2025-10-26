# Finalisation in Destructors

Trong Rust, destructors (hay còn gọi là "drop handlers") được gọi tự động khi một value ra khỏi scope. Điều này cho phép chúng ta thực hiện các tác vụ cleanup một cách tự động và an toàn.

## Drop Trait

Rust cung cấp [`Drop` trait](https://doc.rust-lang.org/std/ops/trait.Drop.html) để customize hành vi khi một value bị dropped:

```rust
struct FileHandler {
    filename: String,
}

impl Drop for FileHandler {
    fn drop(&mut self) {
        println!("Closing file: {}", self.filename);
        // Cleanup code ở đây
    }
}

fn main() {
    let handler = FileHandler {
        filename: "data.txt".to_string(),
    };
    println!("Working with file...");

    // Khi handler ra khỏi scope, drop() sẽ được gọi tự động
}
// Output:
// Working with file...
// Closing file: data.txt
```

## Use Cases phổ biến

### 1. Resource Management (RAII Pattern)

RAII (Resource Acquisition Is Initialization) là một pattern quan trọng trong Rust:

```rust
use std::fs::File;
use std::io::Write;

struct Logger {
    file: File,
}

impl Logger {
    fn new(path: &str) -> std::io::Result<Self> {
        Ok(Logger {
            file: File::create(path)?,
        })
    }

    fn log(&mut self, message: &str) -> std::io::Result<()> {
        writeln!(self.file, "{}", message)
    }
}

impl Drop for Logger {
    fn drop(&mut self) {
        writeln!(self.file, "Logger closed").ok();
        // File sẽ tự động được đóng khi ra khỏi scope
    }
}

fn main() -> std::io::Result<()> {
    {
        let mut logger = Logger::new("app.log")?;
        logger.log("Application started")?;
        logger.log("Processing data")?;
        // Logger tự động flush và đóng file khi ra khỏi scope
    }

    Ok(())
}
```

### 2. Lock Management

Sử dụng Drop để tự động release locks:

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let data = Arc::new(Mutex::new(vec![1, 2, 3]));
    let mut handles = vec![];

    for i in 0..3 {
        let data = Arc::clone(&data);
        let handle = thread::spawn(move || {
            let mut locked_data = data.lock().unwrap();
            locked_data.push(i);
            // Lock tự động được release khi locked_data ra khỏi scope
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {:?}", *data.lock().unwrap());
}
```

### 3. Connection Pooling

```rust
struct DatabaseConnection {
    id: u32,
}

impl DatabaseConnection {
    fn new(id: u32) -> Self {
        println!("Opening database connection #{}", id);
        DatabaseConnection { id }
    }

    fn execute(&self, query: &str) {
        println!("Connection #{} executing: {}", self.id, query);
    }
}

impl Drop for DatabaseConnection {
    fn drop(&mut self) {
        println!("Closing database connection #{}", self.id);
        // Return connection to pool
    }
}

fn main() {
    {
        let conn = DatabaseConnection::new(1);
        conn.execute("SELECT * FROM users");
        // Connection tự động được trả về pool khi ra khỏi scope
    }
    println!("Connection has been returned to pool");
}
```

## Thứ tự Drop

Rust drop các values theo thứ tự ngược lại với thứ tự chúng được tạo ra:

```rust
struct PrintOnDrop(&'static str);

impl Drop for PrintOnDrop {
    fn drop(&mut self) {
        println!("Dropping: {}", self.0);
    }
}

fn main() {
    let _first = PrintOnDrop("First");
    let _second = PrintOnDrop("Second");
    let _third = PrintOnDrop("Third");

    println!("End of main");
}
// Output:
// End of main
// Dropping: Third
// Dropping: Second
// Dropping: First
```

## Drop với Struct Fields

Fields trong một struct được dropped theo thứ tự khai báo:

```rust
struct Container {
    first: PrintOnDrop,
    second: PrintOnDrop,
}

impl Drop for Container {
    fn drop(&mut self) {
        println!("Dropping Container");
    }
}

fn main() {
    let _container = Container {
        first: PrintOnDrop("Field 1"),
        second: PrintOnDrop("Field 2"),
    };
}
// Output:
// Dropping Container
// Dropping: Field 1
// Dropping: Field 2
```

## Manual Drop với `std::mem::drop`

Đôi khi cần drop một value trước khi nó ra khỏi scope:

```rust
fn main() {
    let handler = FileHandler {
        filename: "data.txt".to_string(),
    };

    println!("Before manual drop");
    drop(handler); // Gọi destructor ngay lập tức
    println!("After manual drop");

    // handler không còn tồn tại ở đây
}
```

## Lưu ý quan trọng

### 1. Không thể gọi `drop()` trực tiếp

```rust
// ❌ Sai: không thể gọi drop() method trực tiếp
// handler.drop(); // Compile error!

// ✅ Đúng: sử dụng std::mem::drop
drop(handler);
```

### 2. Drop không được gọi trong panic

Nếu panic xảy ra trong `drop()`, chương trình sẽ abort:

```rust
impl Drop for Risky {
    fn drop(&mut self) {
        // Tránh panic trong drop!
        if let Err(e) = self.cleanup() {
            eprintln!("Cleanup failed: {}", e);
            // Log error nhưng không panic
        }
    }
}
```

### 3. Copy types không có Drop

Types implement `Copy` không thể implement `Drop`:

```rust
// ❌ Compile error: Copy và Drop không thể cùng tồn tại
#[derive(Copy, Clone)]
struct CopyType {
    value: i32,
}

impl Drop for CopyType {
    fn drop(&mut self) {
        // Error: Copy type cannot implement Drop
    }
}
```

## Best Practices

1. **Giữ `drop()` đơn giản**: Tránh logic phức tạp trong destructor
2. **Không panic**: Handle errors gracefully trong `drop()`
3. **Sử dụng RAII**: Tự động quản lý resources thông qua scope
4. **Document behavior**: Ghi rõ side effects của destructor

## Ví dụ thực tế: Guard Pattern

```rust
use std::fs::File;
use std::io::Write;

struct FileGuard {
    file: Option<File>,
    path: String,
}

impl FileGuard {
    fn new(path: &str) -> std::io::Result<Self> {
        Ok(FileGuard {
            file: Some(File::create(path)?),
            path: path.to_string(),
        })
    }

    fn write(&mut self, data: &str) -> std::io::Result<()> {
        if let Some(ref mut file) = self.file {
            writeln!(file, "{}", data)
        } else {
            Err(std::io::Error::new(
                std::io::ErrorKind::Other,
                "File already closed",
            ))
        }
    }
}

impl Drop for FileGuard {
    fn drop(&mut self) {
        if let Some(file) = self.file.take() {
            drop(file); // Explicit flush
            println!("File '{}' has been closed", self.path);
        }
    }
}

fn main() -> std::io::Result<()> {
    let mut guard = FileGuard::new("output.txt")?;
    guard.write("Hello")?;
    guard.write("World")?;

    // File sẽ tự động được flush và close
    Ok(())
}
```

## Tham khảo

- [The Drop Trait](https://doc.rust-lang.org/book/ch15-03-drop.html)
- [std::ops::Drop](https://doc.rust-lang.org/std/ops/trait.Drop.html)
- [std::mem::drop](https://doc.rust-lang.org/std/mem/fn.drop.html)
