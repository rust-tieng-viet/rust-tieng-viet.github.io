# let-else Pattern

`let-else` là một tính năng được giới thiệu trong Rust 1.65 (2022), cho phép pattern matching với early return một cách elegant và concise.

## Syntax cơ bản

```rust
let PATTERN = EXPRESSION else {
    DIVERGING_CODE
};
```

Nếu pattern matching thất bại, code trong `else` block sẽ chạy. Block này phải diverge (return, break, continue, panic, etc.)

## Ví dụ đơn giản

### Với Option

```rust
fn process_value(maybe_value: Option<i32>) {
    let Some(value) = maybe_value else {
        println!("No value provided");
        return;
    };

    // value có type i32, không phải Option<i32>
    println!("Processing: {}", value);
}

fn main() {
    process_value(Some(42));  // Processing: 42
    process_value(None);       // No value provided
}
```

### Với Result

```rust
fn parse_config(input: &str) -> Result<(), String> {
    let Ok(port) = input.parse::<u16>() else {
        return Err("Invalid port number".to_string());
    };

    println!("Port: {}", port);
    Ok(())
}

fn main() {
    parse_config("8080").ok();  // Port: 8080
    parse_config("invalid").ok(); // Returns Err
}
```

## So sánh với các approaches khác

### ❌ Before let-else (verbose)

```rust
fn get_first_word(text: &str) -> Result<String, &'static str> {
    let words: Vec<&str> = text.split_whitespace().collect();

    // Cách 1: if-let với nested logic
    if let Some(first) = words.first() {
        Ok(first.to_string())
    } else {
        Err("No words found")
    }
}
```

```rust
fn get_first_word(text: &str) -> Result<String, &'static str> {
    let words: Vec<&str> = text.split_whitespace().collect();

    // Cách 2: match
    match words.first() {
        Some(first) => Ok(first.to_string()),
        None => Err("No words found"),
    }
}
```

### ✅ With let-else (concise)

```rust
fn get_first_word(text: &str) -> Result<String, &'static str> {
    let words: Vec<&str> = text.split_whitespace().collect();

    let Some(first) = words.first() else {
        return Err("No words found");
    };

    Ok(first.to_string())
}
```

## Use Cases

### 1. Function argument validation

```rust
fn create_user(name: Option<String>, age: Option<u32>) -> Result<User, String> {
    let Some(name) = name else {
        return Err("Name is required".to_string());
    };

    let Some(age) = age else {
        return Err("Age is required".to_string());
    };

    if age < 18 {
        return Err("Must be 18 or older".to_string());
    }

    Ok(User { name, age })
}

struct User {
    name: String,
    age: u32,
}

fn main() {
    match create_user(Some("Alice".to_string()), Some(25)) {
        Ok(user) => println!("Created user: {}", user.name),
        Err(e) => println!("Error: {}", e),
    }
}
```

### 2. Parsing và validation

```rust
fn parse_port(s: &str) -> Result<u16, String> {
    let Ok(port) = s.parse::<u16>() else {
        return Err(format!("'{}' is not a valid port number", s));
    };

    if port < 1024 {
        return Err(format!("Port {} is reserved", port));
    }

    Ok(port)
}

fn main() {
    println!("{:?}", parse_port("8080"));    // Ok(8080)
    println!("{:?}", parse_port("invalid")); // Err(...)
    println!("{:?}", parse_port("80"));      // Err("Port 80 is reserved")
}
```

### 3. Destructuring structs/tuples

```rust
struct Point {
    x: i32,
    y: i32,
}

fn process_point(maybe_point: Option<Point>) {
    let Some(Point { x, y }) = maybe_point else {
        println!("No point provided");
        return;
    };

    println!("Point: ({}, {})", x, y);
}

fn main() {
    process_point(Some(Point { x: 10, y: 20 }));
    process_point(None);
}
```

### 4. Working với enums

```rust
enum Message {
    Text(String),
    Number(i32),
}

fn process_text(msg: Message) -> Result<(), String> {
    let Message::Text(content) = msg else {
        return Err("Expected text message".to_string());
    };

    println!("Text: {}", content);
    Ok(())
}

fn main() {
    process_text(Message::Text("Hello".to_string())).ok();
    process_text(Message::Number(42)).ok();
}
```

### 5. Guard clauses

```rust
fn calculate_discount(price: f64, coupon: Option<String>) -> f64 {
    let Some(code) = coupon else {
        return price; // No discount
    };

    let discount = match code.as_str() {
        "SAVE10" => 0.10,
        "SAVE20" => 0.20,
        _ => return price, // Invalid code
    };

    price * (1.0 - discount)
}

fn main() {
    println!("{}", calculate_discount(100.0, Some("SAVE10".to_string()))); // 90
    println!("{}", calculate_discount(100.0, None)); // 100
}
```

## Multiple let-else trong sequence

```rust
fn process_config(
    host: Option<String>,
    port: Option<String>,
) -> Result<(String, u16), String> {
    let Some(host) = host else {
        return Err("Host is required".to_string());
    };

    let Some(port_str) = port else {
        return Err("Port is required".to_string());
    };

    let Ok(port) = port_str.parse::<u16>() else {
        return Err(format!("Invalid port: {}", port_str));
    };

    Ok((host, port))
}

fn main() {
    let result = process_config(
        Some("localhost".to_string()),
        Some("8080".to_string()),
    );
    println!("{:?}", result); // Ok(("localhost", 8080))
}
```

## Pattern với slices

```rust
fn get_first_two(numbers: &[i32]) -> Result<(i32, i32), &'static str> {
    let [first, second, ..] = numbers else {
        return Err("Need at least 2 elements");
    };

    Ok((*first, *second))
}

fn main() {
    println!("{:?}", get_first_two(&[1, 2, 3]));    // Ok((1, 2))
    println!("{:?}", get_first_two(&[1]));           // Err(...)
}
```

## Combining với other patterns

### let-else + if-let

```rust
fn process_nested(value: Option<Option<i32>>) {
    let Some(inner) = value else {
        println!("Outer None");
        return;
    };

    if let Some(number) = inner {
        println!("Number: {}", number);
    } else {
        println!("Inner None");
    }
}
```

### let-else + while-let

```rust
fn process_iterator(mut iter: impl Iterator<Item = Result<i32, String>>) {
    while let Some(result) = iter.next() {
        let Ok(value) = result else {
            eprintln!("Skipping error");
            continue;
        };

        println!("Value: {}", value);
    }
}
```

## Best practices

### ✅ Use khi có early return

```rust
// ✅ Good: early return
fn process(value: Option<i32>) -> Result<i32, String> {
    let Some(v) = value else {
        return Err("No value".to_string());
    };

    Ok(v * 2)
}
```

### ❌ Avoid cho simple cases

```rust
// ❌ Overkill for simple case
let Some(value) = option else {
    panic!("No value");
};

// ✅ Better
let value = option.expect("No value");
```

### ✅ Use cho validation chains

```rust
fn validate_user(
    name: Option<String>,
    email: Option<String>,
    age: Option<u32>,
) -> Result<User, String> {
    let Some(name) = name else {
        return Err("Name required".to_string());
    };

    let Some(email) = email else {
        return Err("Email required".to_string());
    };

    let Some(age) = age else {
        return Err("Age required".to_string());
    };

    // All validations passed
    Ok(User { name, age })
}
```

## Error messages

```rust
fn parse_number(s: &str) -> Result<i32, String> {
    let Ok(num) = s.parse::<i32>() else {
        // Có thể customize error message
        return Err(format!(
            "Failed to parse '{}' as number",
            s
        ));
    };

    Ok(num)
}
```

## let-else vs unwrap/expect

```rust
// ❌ Using unwrap (panics)
let value = option.unwrap();

// ❌ Using expect (panics with message)
let value = option.expect("Value required");

// ✅ Using let-else (controlled error handling)
let Some(value) = option else {
    return Err("Value required".to_string());
};
```

## Real-world example: Request handling

```rust
#[derive(Debug)]
struct Request {
    path: String,
    method: String,
    body: Option<String>,
}

fn handle_create_user(req: Request) -> Result<String, String> {
    // Validate method
    if req.method != "POST" {
        return Err(format!("Expected POST, got {}", req.method));
    }

    // Validate body exists
    let Some(body) = req.body else {
        return Err("Request body is required".to_string());
    };

    // Parse body as JSON (simplified)
    let Ok(user_data) = serde_json::from_str::<serde_json::Value>(&body) else {
        return Err("Invalid JSON".to_string());
    };

    // Extract name
    let Some(name) = user_data.get("name").and_then(|v| v.as_str()) else {
        return Err("Missing 'name' field".to_string());
    };

    Ok(format!("Created user: {}", name))
}
```

## Limitations

1. **else block must diverge**: Phải return, break, continue, hoặc panic
2. **Cannot use với if-let chains**: Chỉ work với `let` statements
3. **Pattern must be refutable**: Không work với irrefutable patterns

## Tham khảo

- [let-else RFC](https://rust-lang.github.io/rfcs/3137-let-else.html)
- [Rust 1.65 Release Notes](https://blog.rust-lang.org/2022/11/03/Rust-1.65.0.html)
- [Pattern Syntax](https://doc.rust-lang.org/book/ch18-03-pattern-syntax.html)
