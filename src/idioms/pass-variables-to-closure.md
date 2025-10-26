# Pass variables to closure

Closures trong Rust có thể capture variables từ môi trường xung quanh. Tuy nhiên, việc pass variables vào closure đôi khi gặp các vấn đề với ownership và borrowing. Có nhiều patterns để giải quyết vấn đề này.

## Vấn đề: Closure captures by reference

Mặc định, closures capture variables bằng reference:

```rust
fn main() {
    let s = String::from("hello");

    let closure = || {
        println!("{}", s); // Capture by reference
    };

    closure();
    println!("{}", s); // s vẫn valid
}
```

Nhưng điều này gây vấn đề khi closure cần outlive scope:

```rust
fn create_closure() -> impl Fn() {
    let s = String::from("hello");

    // ❌ Compile error!
    // || println!("{}", s) // s doesn't live long enough
}
```

## Solution 1: Move closure

Sử dụng `move` keyword để transfer ownership:

```rust
fn create_closure() -> impl Fn() {
    let s = String::from("hello");

    // ✅ Move ownership vào closure
    move || println!("{}", s)
}

fn main() {
    let closure = create_closure();
    closure(); // "hello"
}
```

## Solution 2: Clone before move

Khi cần giữ lại original value:

```rust
fn main() {
    let s = String::from("hello");

    // Clone trước khi move
    let s_clone = s.clone();
    let closure = move || {
        println!("{}", s_clone);
    };

    closure();
    println!("Original: {}", s); // s vẫn còn
}
```

## Solution 3: Explicit move trong closure

```rust
fn main() {
    let s = String::from("hello");

    let closure = {
        let s = s.clone(); // Clone trong block
        move || println!("{}", s)
    };

    println!("Original: {}", s); // s vẫn còn
    closure();
}
```

## Pattern: Rebinding với move

Một pattern phổ biến là rebinding variable với cùng tên:

```rust
fn main() {
    let data = vec![1, 2, 3];

    // Rebind để cho rõ ràng
    let data = data.clone();

    let closure = move || {
        println!("{:?}", data);
    };

    // data original đã bị moved
    closure();
}
```

## Working với multiple variables

### ❌ Vấn đề: Partial move

```rust
fn main() {
    let x = String::from("x");
    let y = String::from("y");

    let closure = move || {
        println!("{}", x); // Only need x
    };

    // ❌ Compile error! y cũng bị moved
    // println!("{}", y);
}
```

### ✅ Solution: Selective cloning

```rust
fn main() {
    let x = String::from("x");
    let y = String::from("y");

    let x = x; // Chỉ move x
    let closure = move || {
        println!("{}", x);
    };

    println!("{}", y); // y vẫn available
    closure();
}
```

## Use case: Thread spawning

```rust
use std::thread;

fn main() {
    let data = vec![1, 2, 3, 4, 5];

    // Clone để thread có ownership
    let data_clone = data.clone();

    let handle = thread::spawn(move || {
        let sum: i32 = data_clone.iter().sum();
        println!("Sum: {}", sum);
    });

    // data vẫn available trong main thread
    println!("Original: {:?}", data);

    handle.join().unwrap();
}
```

## Pattern: Reference counted (Arc)

Khi cần share data giữa nhiều closures/threads:

```rust
use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![1, 2, 3, 4, 5]);

    let mut handles = vec![];

    for i in 0..3 {
        let data = Arc::clone(&data);

        let handle = thread::spawn(move || {
            println!("Thread {}: {:?}", i, data);
        });

        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
}
```

## Capturing specific fields

Khi chỉ cần capture một field từ struct:

```rust
struct Config {
    name: String,
    value: i32,
}

fn main() {
    let config = Config {
        name: "test".to_string(),
        value: 42,
    };

    // Chỉ capture field cần thiết
    let name = config.name.clone();
    let closure = move || {
        println!("Name: {}", name);
    };

    // config.value vẫn available
    println!("Value: {}", config.value);
    closure();
}
```

## Pattern: Combinator style

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    let threshold = 3;

    // Clone threshold để use nhiều lần
    let filtered: Vec<i32> = numbers
        .iter()
        .filter(|&&n| n > threshold)
        .copied()
        .collect();

    println!("{:?}", filtered);
}
```

## Closure với mutable variables

```rust
fn main() {
    let mut count = 0;

    {
        let mut closure = || {
            count += 1;
            println!("Count: {}", count);
        };

        closure(); // 1
        closure(); // 2
    }

    println!("Final: {}", count); // 2
}
```

### Move với mutable

```rust
fn main() {
    let mut count = 0;

    let mut closure = move || {
        count += 1; // Modifying moved copy
        count
    };

    println!("{}", closure()); // 1
    println!("{}", closure()); // 2

    // Original count vẫn là 0
    println!("Original: {}", count); // 0
}
```

## Real-world example: Event handlers

```rust
struct Button {
    on_click: Box<dyn Fn()>,
}

impl Button {
    fn new<F>(on_click: F) -> Self
    where
        F: Fn() + 'static,
    {
        Button {
            on_click: Box::new(on_click),
        }
    }

    fn click(&self) {
        (self.on_click)();
    }
}

fn main() {
    let message = String::from("Button clicked!");

    let button = Button::new(move || {
        println!("{}", message);
    });

    button.click();
    button.click();
}
```

## Pattern: Builder with closures

```rust
struct Request {
    url: String,
    on_success: Box<dyn Fn(String)>,
    on_error: Box<dyn Fn(String)>,
}

impl Request {
    fn new(url: String) -> RequestBuilder {
        RequestBuilder {
            url,
            on_success: None,
            on_error: None,
        }
    }
}

struct RequestBuilder {
    url: String,
    on_success: Option<Box<dyn Fn(String)>>,
    on_error: Option<Box<dyn Fn(String)>>,
}

impl RequestBuilder {
    fn on_success<F>(mut self, callback: F) -> Self
    where
        F: Fn(String) + 'static,
    {
        self.on_success = Some(Box::new(callback));
        self
    }

    fn on_error<F>(mut self, callback: F) -> Self
    where
        F: Fn(String) + 'static,
    {
        self.on_error = Some(Box::new(callback));
        self
    }

    fn send(self) {
        // Simulate request
        let success = true;

        if success {
            if let Some(callback) = self.on_success {
                callback("Success!".to_string());
            }
        } else {
            if let Some(callback) = self.on_error {
                callback("Error!".to_string());
            }
        }
    }
}

fn main() {
    let prefix = String::from("[LOG]");

    Request::new("https://api.example.com".to_string())
        .on_success(move |msg| {
            println!("{} {}", prefix, msg);
        })
        .send();
}
```

## Closure types và capture modes

Rust có 3 closure traits tùy thuộc vào cách capture:

```rust
fn main() {
    let s = String::from("hello");

    // FnOnce: Consumes captured variables
    let consume = move || {
        drop(s); // Takes ownership
    };
    consume();
    // consume(); // ❌ Can't call twice

    let s = String::from("hello");

    // FnMut: Mutably borrows captured variables
    let mut mutate = || {
        s.push_str(" world"); // ❌ Won't compile: can't mutate
    };

    let mut s = String::from("hello");

    // Fn: Immutably borrows captured variables
    let borrow = || {
        println!("{}", s); // Just reads
    };
    borrow();
    borrow(); // ✅ Can call multiple times
}
```

## Best Practices

1. **Clone judiciously**: Chỉ clone khi cần thiết
2. **Use `Arc` cho shared ownership**: Đặc biệt với threads
3. **Prefer `move` cho long-lived closures**: Tránh lifetime issues
4. **Document capture behavior**: Ghi rõ closure captures gì
5. **Consider using structs**: Cho complex state management

## Common mistakes

### ❌ Forgetting move with threads

```rust
// ❌ Won't compile
fn wrong() {
    let data = vec![1, 2, 3];

    thread::spawn(|| {
        println!("{:?}", data); // Error: may outlive borrowed value
    });
}

// ✅ Correct
fn correct() {
    let data = vec![1, 2, 3];

    thread::spawn(move || {
        println!("{:?}", data);
    });
}
```

### ❌ Moving when you need to borrow

```rust
fn wrong() {
    let data = vec![1, 2, 3];

    let closure = move || {
        println!("{:?}", data);
    };

    closure();
    // println!("{:?}", data); // ❌ Error: value moved
}

// ✅ Just borrow
fn correct() {
    let data = vec![1, 2, 3];

    let closure = || {
        println!("{:?}", data);
    };

    closure();
    println!("{:?}", data); // ✅ Still available
}
```

## Tham khảo

- [Closures: Anonymous Functions that Capture Their Environment](https://doc.rust-lang.org/book/ch13-01-closures.html)
- [Closure types (Fn, FnMut, FnOnce)](https://doc.rust-lang.org/book/ch13-01-closures.html#closure-type-inference-and-annotation)
